export type ReceiptSource = 'spotify' | 'transaction' | 'household';

export interface Receipt {
  id: string;
  source: ReceiptSource;
  timestamp: number;
  dateStr: string;
  title: string;
  subtitle?: string;
  category?: string;
  amount?: number;
  currency?: string;
  durationMs?: number;
  album?: string;
  tags?: string[];
  metadata?: Record<string, string | number | boolean | null>;
}

export interface SpotifySummary {
  totalCount: number;
  monthly: Record<string, number>;
  topArtists: Array<{ name: string; count: number }>;
  topTracks: Array<{ name: string; count: number }>;
  platforms: Record<string, number>;
  hourBins: {
    morning: number;
    afternoon: number;
    evening: number;
    lateNight: number;
    dawn: number;
  };
  weekdays: Array<{ day: string; count: number; pct: string }>;
  shuffleCount: number;
  skipCount: number;
  totalPlayTimeMs: number;
}

export interface TransactionSummary {
  totalCount: number;
  monthly: Record<string, { count: number; amount: number }>;
  categories: Array<{ name: string; count: number }>;
}

export interface HouseholdSummary {
  totalCount: number;
  monthly: Record<string, { count: number; expense: number; income: number }>;
  categories: Array<{ name: string; count: number }>;
}
