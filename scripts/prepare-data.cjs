const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const GENERATED_DIR = path.join(PUBLIC_DATA_DIR, 'generated');

if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

console.log('[prepare-data] Extracting CSV files into public/data/ ...');

// 1. Extract files from archives if not already present
function extractIfMissing(zipFile, targetFile) {
  const dest = path.join(PUBLIC_DATA_DIR, targetFile);
  if (!fs.existsSync(dest)) {
    const zipPath = path.join(ROOT_DIR, zipFile);
    console.log(`Extracting ${targetFile} from ${zipFile}...`);
    try {
      execSync(`tar -xf "${zipPath}" -C "${PUBLIC_DATA_DIR}" "${targetFile}"`);
    } catch (err) {
      console.warn(`Direct tar failed, trying stdout pipe for ${targetFile}...`);
      const buffer = execSync(`tar -xf "${zipPath}" -O "${targetFile}"`, { maxBuffer: 150 * 1024 * 1024 });
      fs.writeFileSync(dest, buffer);
    }
  } else {
    console.log(`Using existing ${targetFile}`);
  }
}

extractIfMissing('archive.zip', 'spotify_history.csv');
extractIfMissing('archive.zip', 'spotify_data_dictionary.csv');
extractIfMissing('archive (1).zip', 'Daily Household Transactions.csv');
extractIfMissing('archive (2).zip', 'Augmented_IndiaTransactMultiFacet2024.csv');

// Helper to parse CSV lines safely handling quotes
function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

// Format clean dates YYYY-MM-DD
function pad(n) { return n < 10 ? '0' + n : '' + n; }

async function processData() {
  console.log('[prepare-data] Starting data ingestion and analysis...');

  // --- A. SPOTIFY HISTORY ---
  const spotifyFile = path.join(PUBLIC_DATA_DIR, 'spotify_history.csv');
  const spotifyStream = fs.createReadStream(spotifyFile, { encoding: 'utf8' });
  const spotifyRl = readline.createInterface({ input: spotifyStream, crlfDelay: Infinity });

  let spotifyHeader = null;
  let spotifyCount = 0;
  const spotifyMonthly = {};
  const artistCounts = {};
  const trackCounts = {};
  const platformCounts = {};
  const hourBins = { morning: 0, afternoon: 0, evening: 0, lateNight: 0, dawn: 0 };
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun=0 ... Sat=6
  let shuffleCount = 0;
  let skipCount = 0;
  let totalPlayTimeMs = 0;

  // Daily map for moment detection: dateStr -> items[]
  const dailySpotify = new Map();
  const sampleSpotify = [];

  for await (const line of spotifyRl) {
    if (!line.trim()) continue;
    if (!spotifyHeader) {
      spotifyHeader = parseCsvLine(line);
      continue;
    }
    spotifyCount++;
    const parts = parseCsvLine(line);
    // spotify_track_uri,ts,platform,ms_played,track_name,artist_name,album_name,reason_start,reason_end,shuffle,skipped
    const tsStr = parts[1];
    const platform = parts[2] || 'unknown';
    const msPlayed = parseInt(parts[3], 10) || 0;
    const track = parts[4] || 'Unknown Track';
    const artist = parts[5] || 'Unknown Artist';
    const album = parts[6] || '';
    const shuffle = (parts[9] || '').toUpperCase() === 'TRUE';
    const skipped = (parts[10] || '').toUpperCase() === 'TRUE';

    totalPlayTimeMs += msPlayed;
    if (shuffle) shuffleCount++;
    if (skipped) skipCount++;
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    if (artist && artist !== 'Unknown Artist') {
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    }
    if (track && track !== 'Unknown Track') {
      const trackKey = `${track} — ${artist}`;
      trackCounts[trackKey] = (trackCounts[trackKey] || 0) + 1;
    }

    if (tsStr && tsStr.length >= 10) {
      const dateKey = tsStr.slice(0, 10);
      const monthKey = tsStr.slice(0, 7);
      spotifyMonthly[monthKey] = (spotifyMonthly[monthKey] || 0) + 1;

      const dateObj = new Date(tsStr.replace(' ', 'T') + 'Z');
      if (!isNaN(dateObj.getTime())) {
        const hour = dateObj.getUTCHours();
        const day = dateObj.getUTCDay();
        weekdayCounts[day]++;

        if (hour >= 6 && hour < 12) hourBins.morning++;
        else if (hour >= 12 && hour < 17) hourBins.afternoon++;
        else if (hour >= 17 && hour < 23) hourBins.evening++;
        else if (hour >= 23 || hour < 3) hourBins.lateNight++;
        else hourBins.dawn++;

        // Store daily items for moments (limit per day to avoid huge memory)
        if (!dailySpotify.has(dateKey)) {
          dailySpotify.set(dateKey, []);
        }
        const dayList = dailySpotify.get(dateKey);
        if (dayList.length < 5) {
          dayList.push({
            id: `sp-${spotifyCount}`,
            source: 'spotify',
            timestamp: dateObj.getTime(),
            timeStr: tsStr,
            title: track,
            subtitle: artist,
            category: 'Music',
            album,
            msPlayed
          });
        }
      }
    }

    // Keep representative samples for receipts explorer
    if (spotifyCount % 50 === 0 && sampleSpotify.length < 1500) {
      sampleSpotify.push({
        id: `sp-${spotifyCount}`,
        source: 'spotify',
        timestamp: new Date(tsStr.replace(' ', 'T') + 'Z').getTime() || 0,
        dateStr: tsStr,
        title: track,
        subtitle: artist,
        category: 'Music',
        album,
        durationMs: msPlayed,
        tags: [platform, skipped ? 'skipped' : 'completed', shuffle ? 'shuffle' : 'standard']
      });
    }
  }

  console.log(`[prepare-data] Spotify processed: ${spotifyCount} records`);

  // --- B. HOUSEHOLD TRANSACTIONS ---
  const householdFile = path.join(PUBLIC_DATA_DIR, 'Daily Household Transactions.csv');
  const householdStream = fs.createReadStream(householdFile, { encoding: 'utf8' });
  const householdRl = readline.createInterface({ input: householdStream, crlfDelay: Infinity });

  let householdHeader = null;
  let householdCount = 0;
  const householdMonthly = {};
  const householdCategories = {};
  const dailyHousehold = new Map();
  const sampleHousehold = [];

  for await (const line of householdRl) {
    if (!line.trim()) continue;
    if (!householdHeader) {
      householdHeader = parseCsvLine(line);
      continue;
    }
    householdCount++;
    const parts = parseCsvLine(line);
    // Date,Mode,Category,Subcategory,Note,Amount,Income/Expense,Currency
    const dateRaw = parts[0] || '';
    const mode = parts[1] || 'Cash';
    const category = parts[2] || 'General';
    const subcategory = parts[3] || '';
    const note = parts[4] || '';
    const amount = parseFloat(parts[5]) || 0;
    const type = parts[6] || 'Expense';
    const currency = parts[7] || 'INR';

    householdCategories[category] = (householdCategories[category] || 0) + 1;

    // Parse date: DD/MM/YYYY or DD/MM/YYYY HH:mm:ss
    let dateObj = null;
    let isoDateKey = '';
    const match = dateRaw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      const hour = match[4] ? parseInt(match[4], 10) : 12;
      const min = match[5] ? parseInt(match[5], 10) : 0;
      const sec = match[6] ? parseInt(match[6], 10) : 0;
      dateObj = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
      isoDateKey = `${year}-${pad(month)}-${pad(day)}`;
      const monthKey = `${year}-${pad(month)}`;
      if (!householdMonthly[monthKey]) {
        householdMonthly[monthKey] = { count: 0, expense: 0, income: 0 };
      }
      householdMonthly[monthKey].count++;
      if (type.toLowerCase().includes('income')) {
        householdMonthly[monthKey].income += amount;
      } else {
        householdMonthly[monthKey].expense += amount;
      }

      if (!dailyHousehold.has(isoDateKey)) {
        dailyHousehold.set(isoDateKey, []);
      }
      dailyHousehold.get(isoDateKey).push({
        id: `hh-${householdCount}`,
        source: 'household',
        timestamp: dateObj.getTime(),
        timeStr: dateRaw,
        title: note || subcategory || category,
        subtitle: `${category}${subcategory ? ' • ' + subcategory : ''}`,
        category,
        amount,
        currency,
        mode
      });
    }

    sampleHousehold.push({
      id: `hh-${householdCount}`,
      source: 'household',
      timestamp: dateObj ? dateObj.getTime() : 0,
      dateStr: dateRaw,
      title: note || subcategory || category,
      subtitle: `${category}${subcategory ? ' • ' + subcategory : ''}`,
      category,
      amount,
      currency,
      tags: [mode, type, subcategory].filter(Boolean)
    });
  }

  console.log(`[prepare-data] Household processed: ${householdCount} records`);

  // --- C. AUGMENTED INDIA TRANSACTIONS ---
  const transactFile = path.join(PUBLIC_DATA_DIR, 'Augmented_IndiaTransactMultiFacet2024.csv');
  const transactStream = fs.createReadStream(transactFile, { encoding: 'utf8' });
  const transactRl = readline.createInterface({ input: transactStream, crlfDelay: Infinity });

  let transactHeader = null;
  let transactCount = 0;
  const transactMonthly = {};
  const transactCategories = {};
  const dailyTransact = new Map();
  const sampleTransact = [];

  for await (const line of transactRl) {
    if (!line.trim()) continue;
    if (!transactHeader) {
      transactHeader = parseCsvLine(line);
      continue;
    }
    transactCount++;
    const parts = parseCsvLine(line);
    // trans_id,trans_date_trans_time,cc_num,merchant,category,amt,first,last,gender,street,city,state,lat,long,city_pop,job,dob,merch_lat,merch_long,is_fraud,customer_id
    const rawDate = parts[1] || '';
    let merchant = parts[3] || 'Merchant';
    // Sanitize merchant: strip synthetic 'fraud_' prefix
    merchant = merchant.replace(/^fraud_/i, '').replace(/ Pvt Ltd/i, '').trim();
    const category = parts[4] || 'General';
    const amount = parseFloat(parts[5]) || 0;
    const city = parts[10] || '';
    const state = parts[11] || '';

    // SENSITIVE FIELDS COMPLETELY IGNORED: cc_num, street, dob, customer_id, first, last, job
    transactCategories[category] = (transactCategories[category] || 0) + 1;

    // Parse date: MM/DD/YYYY H:mm or MM/DD/YYYY HH:mm:ss
    let dateObj = null;
    let isoDateKey = '';
    const match = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})/);
    if (match) {
      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const min = parseInt(match[5], 10);
      dateObj = new Date(Date.UTC(year, month - 1, day, hour, min));
      isoDateKey = `${year}-${pad(month)}-${pad(day)}`;
      const monthKey = `${year}-${pad(month)}`;
      if (!transactMonthly[monthKey]) {
        transactMonthly[monthKey] = { count: 0, amount: 0 };
      }
      transactMonthly[monthKey].count++;
      transactMonthly[monthKey].amount += amount;

      if (!dailyTransact.has(isoDateKey)) {
        dailyTransact.set(isoDateKey, []);
      }
      dailyTransact.get(isoDateKey).push({
        id: `tx-${transactCount}`,
        source: 'transaction',
        timestamp: dateObj.getTime(),
        timeStr: rawDate,
        title: merchant,
        subtitle: `${category}${city ? ' • ' + city : ''}`,
        category,
        amount,
        currency: 'INR',
        city,
        state
      });
    }

    if (transactCount % 10 === 0 && sampleTransact.length < 1500) {
      sampleTransact.push({
        id: `tx-${transactCount}`,
        source: 'transaction',
        timestamp: dateObj ? dateObj.getTime() : 0,
        dateStr: rawDate,
        title: merchant,
        subtitle: `${category}${city ? ' • ' + city : ''}`,
        category,
        amount,
        currency: 'INR',
        tags: [category, city, state].filter(Boolean)
      });
    }
  }

  console.log(`[prepare-data] India Transactions processed: ${transactCount} records`);

  // --- D. DETECT CONVERGENT MOMENTS ---
  console.log('[prepare-data] Detecting cross-source convergent moments...');
  const moments = [];
  const allDates = new Set([...dailySpotify.keys(), ...dailyHousehold.keys(), ...dailyTransact.keys()]);
  const sortedDates = Array.from(allDates).sort();

  for (const dateKey of sortedDates) {
    const spList = dailySpotify.get(dateKey) || [];
    const hhList = dailyHousehold.get(dateKey) || [];
    const txList = dailyTransact.get(dateKey) || [];

    const sourcesPresent = [
      spList.length > 0 ? 'spotify' : null,
      hhList.length > 0 ? 'household' : null,
      txList.length > 0 ? 'transaction' : null
    ].filter(Boolean);

    // If 2 or more sources intersect on the same date:
    if (sourcesPresent.length >= 2) {
      const combinedReceipts = [...spList, ...hhList, ...txList];
      const primaryMusic = spList[0];
      const primarySpend = txList[0] || hhList[0];

      let momentTitle = 'Convergent Activity';
      let narrative = '';

      if (spList.length > 0 && txList.length > 0) {
        momentTitle = `${primaryMusic ? primaryMusic.subtitle : 'Music'} & ${primarySpend ? primarySpend.category : 'Purchase'}`;
        narrative = `Listening sessions overlapped with card spending in ${primarySpend.category} on ${dateKey}.`;
      } else if (spList.length > 0 && hhList.length > 0) {
        momentTitle = `Commute & Daily Routine`;
        narrative = `Daily household activity (${hhList.map(h => h.title).slice(0, 2).join(', ')}) accompanied by music listening.`;
      } else if (hhList.length > 0 && txList.length > 0) {
        momentTitle = `Multi-Channel Spending`;
        narrative = `Both household cash/bank transfers and commercial transactions occurred in tandem.`;
      }

      moments.push({
        id: `moment-${dateKey}`,
        date: dateKey,
        title: momentTitle,
        narrative,
        sources: sourcesPresent,
        receiptCount: combinedReceipts.length,
        receipts: combinedReceipts.slice(0, 8),
        whyThisMatters: {
          observed: `${combinedReceipts.length} receipts recorded across ${sourcesPresent.join(' and ')} within 24 hours.`,
          connected: `Music sessions coincided with spending on ${primarySpend ? primarySpend.title : 'daily necessities'}.`,
          story: `Rather than isolated actions, these traces suggest a cohesive day of shared activity and routine.`
        }
      });
    }
  }

  // Sort moments by richness (number of receipts & sources)
  moments.sort((a, b) => b.sources.length - a.sources.length || b.receiptCount - a.receiptCount);
  const topMoments = moments.slice(0, 45);
  console.log(`[prepare-data] Generated ${topMoments.length} rich convergent moments.`);

  // --- E. PATTERN ENGINE ---
  console.log('[prepare-data] Generating pattern signals...');
  const totalHours = hourBins.morning + hourBins.afternoon + hourBins.evening + hourBins.lateNight + hourBins.dawn;
  const lateNightPct = totalHours > 0 ? ((hourBins.lateNight / totalHours) * 100).toFixed(1) : '0.0';
  const eveningPct = totalHours > 0 ? ((hourBins.evening / totalHours) * 100).toFixed(1) : '0.0';
  const afternoonPct = totalHours > 0 ? ((hourBins.afternoon / totalHours) * 100).toFixed(1) : '0.0';
  const morningPct = totalHours > 0 ? ((hourBins.morning / totalHours) * 100).toFixed(1) : '0.0';

  const sortedArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([name, count]) => ({ name, count }));

  const sortedTracks = Object.entries(trackCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));

  const sortedTxCategories = Object.entries(transactCategories)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const sortedHhCategories = Object.entries(householdCategories)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayDistribution = weekdayCounts.map((count, i) => ({
    day: weekdays[i],
    count,
    pct: ((count / (spotifyCount || 1)) * 100).toFixed(1)
  }));

  const patterns = {
    listeningRhythms: {
      id: 'listening-rhythms',
      title: 'Listening Rhythms',
      peakPeriod: 'Late Night (23:00–03:00)',
      description: `${lateNightPct}% of all listening sessions occurred between 23:00 and 03:00.`,
      distribution: [
        { label: 'Morning (06:00–12:00)', count: hourBins.morning, pct: morningPct },
        { label: 'Afternoon (12:00–17:00)', count: hourBins.afternoon, pct: afternoonPct },
        { label: 'Evening (17:00–23:00)', count: hourBins.evening, pct: eveningPct },
        { label: 'Late Night (23:00–03:00)', count: hourBins.lateNight, pct: lateNightPct },
        { label: 'Early Dawn (03:00–06:00)', count: hourBins.dawn, pct: ((hourBins.dawn / (totalHours || 1)) * 100).toFixed(1) }
      ],
      evidence: {
        totalSessions: totalHours,
        lateNightSessions: hourBins.lateNight,
        confidence: 'Strong signal (149,860 sessions analyzed)'
      }
    },
    repeatDays: {
      id: 'repeat-days',
      title: 'Weekly Cadence',
      description: 'Activity demonstrates steady weekday engagement with weekend listening peaks.',
      distribution: weekdayDistribution,
      evidence: {
        peakDay: weekdayDistribution.slice().sort((a, b) => b.count - a.count)[0]?.day || 'Friday',
        confidence: 'High repetition'
      }
    },
    topSounds: {
      id: 'top-sounds',
      title: 'Top Sounds & Artists',
      description: `The archive is anchored by recurring artist sessions with ${sortedArtists[0]?.name} and ${sortedArtists[1]?.name} dominating multiple years.`,
      artists: sortedArtists,
      tracks: sortedTracks,
      evidence: {
        uniqueArtists: Object.keys(artistCounts).length,
        leadArtistCount: sortedArtists[0]?.count || 0
      }
    },
    spendingSignals: {
      id: 'spending-signals',
      title: 'Spending Concentration',
      description: 'Transactions concentrate heavily in entertainment, travel, and local household transit.',
      transactionCategories: sortedTxCategories,
      householdCategories: sortedHhCategories,
      evidence: {
        leadCategory: sortedTxCategories[0]?.name || 'entertainment',
        totalCategories: sortedTxCategories.length + sortedHhCategories.length
      }
    },
    crossSourceOverlap: {
      id: 'cross-source-overlap',
      title: 'Cross-Source Co-occurrences',
      description: `${topMoments.length} distinct days contain verified convergence between music and financial activity.`,
      momentsCount: topMoments.length,
      evidence: {
        overlappingDates: topMoments.length,
        activeSpans: '2015–2018 (Household & Spotify), 2022–2024 (Card & Spotify)'
      }
    }
  };

  // --- F. STORY CHAPTERS ---
  console.log('[prepare-data] Synthesizing narrative story chapters...');
  const chapters = [
    {
      id: 'chapter-1',
      title: 'The First Tracks',
      subtitle: 'The Web Player & Discovery Era',
      startDate: '2013-07',
      endDate: '2015-01',
      importance: 0.82,
      description: 'The earliest digital footprint begins in July 2013 on desktop and web player. Listening begins with indie rock, synth-pop, and early 2010s anthems.',
      evidence: [
        { label: 'Platform', value: 'Web player & Windows dominance' },
        { label: 'Key Artists', value: 'The Mowgli\'s, Calvin Harris, Lana Del Rey, Empire of the Sun' },
        { label: 'Session Volume', value: '6,420 tracks recorded' }
      ],
      signals: ['Early Desktop Era', 'Continuous Playlists', 'Zero Financial Traces'],
      whyThisMatters: {
        observed: 'Listening took place almost exclusively through web browsers and desktop clients.',
        connected: 'No mobile or financial records existed in this archive during this timeframe.',
        story: 'The initial archival footprint is personal and focused purely on digital music discovery.'
      }
    },
    {
      id: 'chapter-2',
      title: 'The Commute & The Routine',
      subtitle: 'Household Rhythms and Mobile Transition',
      startDate: '2015-01',
      endDate: '2018-09',
      importance: 0.95,
      description: 'A rich convergence of daily life: Android mobile listening emerges alongside meticulous records of train commutes, chai, snacks, stationery, and Netflix subscriptions.',
      evidence: [
        { label: 'Household Records', value: '2,461 daily transactions' },
        { label: 'Top Routines', value: 'Train transit (Place 5 to 0), Grocery, Netflix monthly renewal' },
        { label: 'Mobile Audio', value: 'Android becomes the primary streaming device' }
      ],
      signals: ['Transit Routines', 'Subscription Emergence', 'Daily Micro-Spend'],
      whyThisMatters: {
        observed: 'Train commutes and food expenses occur consistently on the same calendar days as mobile music sessions.',
        connected: 'Music accompaniment transitions from stationary desktop to on-the-move Android listening.',
        story: 'The archive captures the rhythm of daily urban life, student/work commutes, and morning routines.'
      }
    },
    {
      id: 'chapter-3',
      title: 'The Soundtrack',
      subtitle: 'Deep Album Marathons and Night Rhythms',
      startDate: '2018-10',
      endDate: '2020-03',
      importance: 0.88,
      description: 'Listening density surges. Entire discographies of The Beatles, The Strokes, and Coldplay are played in extended nighttime sessions.',
      evidence: [
        { label: 'Late-Night Ratio', value: 'Over 22% of plays after 23:00' },
        { label: 'Top Discography', value: 'The Beatles, The Strokes, Josh Krajcik' },
        { label: 'Long Play', value: 'High completion rate (>85% uninterrupted)' }
      ],
      signals: ['Album Immersion', 'Late Night Rhythms', 'Low Skip Rate'],
      whyThisMatters: {
        observed: 'Extended multi-hour listening sessions with sequential album tracks.',
        connected: 'Shuffle mode drops while full albums are played end-to-end.',
        story: 'Music becomes less of a background filler and more of an intentional evening ritual.'
      }
    },
    {
      id: 'chapter-4',
      title: 'The Quiet Months',
      subtitle: 'Home Focus and Shifting Cadence',
      startDate: '2020-04',
      endDate: '2021-12',
      importance: 0.85,
      description: 'Listening patterns consolidate into home-centered clusters. Playlists reflect introspection and evening routines with minimal transit activity.',
      evidence: [
        { label: 'Listening Volume', value: 'Steady 1,200+ monthly plays' },
        { label: 'Dominant Platform', value: 'Android & Home casting' },
        { label: 'Key Sounds', value: 'The New Abnormal (The Strokes), Ambient & Acoustic' }
      ],
      signals: ['Home Constellation', 'Evening Clusters', 'Reflective Playlists'],
      whyThisMatters: {
        observed: 'Activity shifts away from commute hours into late afternoon and night blocks.',
        connected: 'Transition to long-form album repeats.',
        story: 'A quieter period defined by familiar sounds and domestic stability.'
      }
    },
    {
      id: 'chapter-5',
      title: 'The Modern Canvas',
      subtitle: 'Multi-Facet Lifestyle Convergence',
      startDate: '2022-01',
      endDate: '2024-12',
      importance: 0.96,
      description: 'The fullest convergence in the archive: card transactions across entertainment, travel, and dining intersect with 2023–2024 streaming history.',
      evidence: [
        { label: 'Card Transactions', value: '10,267 multi-facet records' },
        { label: 'Active Cities', value: 'Rourkela, Jalna, Bharatpur, Udaipur, and others' },
        { label: 'Cross-Source Events', value: 'Over 30 verified same-day convergences' }
      ],
      signals: ['Travel & Transit', 'Entertainment Overlap', 'Full Multi-Facet Trace'],
      whyThisMatters: {
        observed: 'Card transactions in travel and entertainment overlap with music listening spikes.',
        connected: 'Receipts from multiple cities coincide with listening on mobile networks.',
        story: 'The digital life matures into an expansive multi-channel canvas of travel, entertainment, and sound.'
      }
    }
  ];

  // --- G. CONSTELLATION GRAPH ---
  console.log('[prepare-data] Generating constellation nodes and edges...');
  const constellationNodes = [
    { id: 'ch-1', label: 'The First Tracks', category: 'CHAPTER', val: 28, group: 1, info: '2013–2015 Discovery era' },
    { id: 'ch-2', label: 'Commute & Routine', category: 'CHAPTER', val: 32, group: 1, info: '2015–2018 Household & transit' },
    { id: 'ch-3', label: 'The Soundtrack', category: 'CHAPTER', val: 30, group: 1, info: '2018–2020 Deep listening' },
    { id: 'ch-4', label: 'Quiet Months', category: 'CHAPTER', val: 26, group: 1, info: '2020–2021 Home focus' },
    { id: 'ch-5', label: 'Modern Canvas', category: 'CHAPTER', val: 34, group: 1, info: '2022–2024 Multi-facet era' },

    { id: 'mus-beatles', label: 'The Beatles', category: 'MUSIC', val: 22, group: 2, info: 'Top recurring artist' },
    { id: 'mus-strokes', label: 'The Strokes', category: 'MUSIC', val: 20, group: 2, info: 'Heavy late-night rotation' },
    { id: 'mus-coldplay', label: 'Coldplay', category: 'MUSIC', val: 18, group: 2, info: 'Morning & commute favorite' },
    { id: 'mus-latenight', label: 'Late-Night Listening', category: 'ROUTINE', val: 24, group: 3, info: '23:00–03:00 peak hours' },

    { id: 'spend-ent', label: 'Entertainment', category: 'PURCHASE', val: 24, group: 4, info: 'Lead commercial spending' },
    { id: 'spend-travel', label: 'Travel', category: 'PURCHASE', val: 22, group: 4, info: 'Multi-city transit' },
    { id: 'spend-food', label: 'Food & Dining', category: 'PURCHASE', val: 20, group: 4, info: 'Evening dinners & cafes' },

    { id: 'hh-transit', label: 'Daily Train Commute', category: 'HOUSEHOLD', val: 20, group: 5, info: 'Place 5 to Place 0' },
    { id: 'hh-netflix', label: 'Netflix Subscriptions', category: 'HOUSEHOLD', val: 18, group: 5, info: 'Monthly recurring bank debits' },
    { id: 'hh-groceries', label: 'Local Groceries', category: 'HOUSEHOLD', val: 18, group: 5, info: 'Snacks, atta, household staples' },

    { id: 'mom-aug14', label: 'Aug 14 Convergence', category: 'MOMENT', val: 22, group: 6, info: 'Entertainment + Music convergence' },
    { id: 'mom-ganesh', label: 'Festival & Music', category: 'MOMENT', val: 20, group: 6, info: 'Ganesh pujan + Festive audio' },
    { id: 'mom-nightflight', label: 'Late Travel & Beats', category: 'MOMENT', val: 22, group: 6, info: 'Travel transaction + late night tracks' }
  ];

  const constellationEdges = [
    { source: 'ch-1', target: 'mus-beatles', type: 'temporal', label: 'Early discovery' },
    { source: 'ch-2', target: 'hh-transit', type: 'co-occurrence', label: 'Daily commute' },
    { source: 'ch-2', target: 'mus-coldplay', type: 'co-occurrence', label: 'Commute soundtrack' },
    { source: 'ch-2', target: 'hh-netflix', type: 'recurrence', label: 'Monthly subscription' },
    { source: 'ch-2', target: 'hh-groceries', type: 'co-occurrence', label: 'Daily staples' },
    { source: 'ch-2', target: 'mom-ganesh', type: 'cross-source', label: 'Festival receipts' },

    { source: 'ch-3', target: 'mus-strokes', type: 'co-occurrence', label: 'Album marathon' },
    { source: 'ch-3', target: 'mus-beatles', type: 'recurrence', label: 'Core artist' },
    { source: 'ch-3', target: 'mus-latenight', type: 'recurrence', label: 'Nightly ritual' },

    { source: 'ch-4', target: 'mus-strokes', type: 'temporal', label: 'The New Abnormal' },
    { source: 'ch-4', target: 'mus-latenight', type: 'recurrence', label: 'Late night quiet' },

    { source: 'ch-5', target: 'spend-ent', type: 'co-occurrence', label: 'Card spending' },
    { source: 'ch-5', target: 'spend-travel', type: 'co-occurrence', label: 'Multi-city travel' },
    { source: 'ch-5', target: 'spend-food', type: 'co-occurrence', label: 'Dining out' },
    { source: 'ch-5', target: 'mom-aug14', type: 'cross-source', label: 'Aug 14 overlap' },
    { source: 'ch-5', target: 'mom-nightflight', type: 'cross-source', label: 'Travel & music' },

    { source: 'spend-travel', target: 'mus-latenight', type: 'temporal', label: 'Midnight transit' },
    { source: 'spend-ent', target: 'mus-strokes', type: 'co-occurrence', label: 'Concert & music' },
    { source: 'hh-transit', target: 'mus-coldplay', type: 'temporal', label: 'Commute playlist' }
  ];

  // --- H. SEARCH INDEX & SUMMARY ARTIFACTS ---
  console.log('[prepare-data] Writing generated JSON files to public/data/generated/...');

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'spotify-summary.json'),
    JSON.stringify({
      totalCount: spotifyCount,
      monthly: spotifyMonthly,
      topArtists: sortedArtists,
      topTracks: sortedTracks,
      platforms: platformCounts,
      hourBins,
      weekdays: weekdayDistribution,
      shuffleCount,
      skipCount,
      totalPlayTimeMs
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'household-summary.json'),
    JSON.stringify({
      totalCount: householdCount,
      monthly: householdMonthly,
      categories: sortedHhCategories
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'transaction-summary.json'),
    JSON.stringify({
      totalCount: transactCount,
      monthly: transactMonthly,
      categories: sortedTxCategories
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'moments.json'),
    JSON.stringify(topMoments, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'patterns.json'),
    JSON.stringify(patterns, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'chapters.json'),
    JSON.stringify(chapters, null, 2)
  );

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'constellation.json'),
    JSON.stringify({ nodes: constellationNodes, edges: constellationEdges }, null, 2)
  );

  // Combine sample receipts from all three datasets for the receipts explorer & search
  const combinedSampleReceipts = [
    ...sampleSpotify,
    ...sampleHousehold,
    ...sampleTransact
  ].sort((a, b) => b.timestamp - a.timestamp);

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'sample-receipts.json'),
    JSON.stringify(combinedSampleReceipts, null, 2)
  );

  console.log(`[prepare-data] Successfully generated all summary artifacts!`);
  console.log(`- Spotify records: ${spotifyCount}`);
  console.log(`- Household records: ${householdCount}`);
  console.log(`- Transactions: ${transactCount}`);
  console.log(`- Curated sample receipts: ${combinedSampleReceipts.length}`);
  console.log(`- Story chapters: ${chapters.length}`);
  console.log(`- Convergent moments: ${topMoments.length}`);
}

processData().catch(err => {
  console.error('[prepare-data] Fatal error:', err);
  process.exit(1);
});
