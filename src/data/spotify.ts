import { SpotifySummary, Receipt } from '../types/receipt';

export interface SpotifyTrack {
  uri: string;
  ts: string;
  platform: string;
  msPlayed: number;
  trackName: string;
  artistName: string;
  albumName: string;
  shuffle: boolean;
  skipped: boolean;
}

export function parseSpotifyRecord(row: Record<string, string>): Receipt {
  const ts = row.ts ? new Date(row.ts.replace(' ', 'T') + 'Z').getTime() : 0;
  return {
    id: `sp-${row.spotify_track_uri || Math.random()}`,
    source: 'spotify',
    timestamp: isNaN(ts) ? 0 : ts,
    dateStr: row.ts || '',
    title: row.track_name || 'Unknown Track',
    subtitle: row.artist_name || 'Unknown Artist',
    category: 'Music',
    album: row.album_name || '',
    durationMs: parseInt(row.ms_played, 10) || 0,
    tags: [row.platform || 'web', row.skipped === 'TRUE' ? 'skipped' : 'completed']
  };
}
