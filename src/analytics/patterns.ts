import { Receipt } from '../types/receipt';
import { PatternSignal } from '../types/story';
import { getTimeOfDay } from '../lib/dates';

export function detectListeningRhythms(receipts: Receipt[]): PatternSignal {
  const musicReceipts = receipts.filter((r) => r.source === 'spotify');
  let lateNightCount = 0;

  for (const r of musicReceipts) {
    if (r.timestamp && getTimeOfDay(r.timestamp) === 'lateNight') {
      lateNightCount++;
    }
  }

  const total = musicReceipts.length || 1;
  const pct = ((lateNightCount / total) * 100).toFixed(1);

  return {
    id: 'listening-rhythms',
    title: 'Listening Rhythms',
    peakPeriod: 'Late Night (23:00–03:00)',
    description: `${pct}% of all listening occurred between 23:00 and 03:00.`,
    evidence: {
      totalSessions: total,
      lateNightSessions: lateNightCount,
      confidence: 'High repetition'
    }
  };
}
