import { StoryChapter, Moment, PatternSignal, ConstellationNode, ConstellationEdge } from '../types/story';
import { SpotifySummary, TransactionSummary, HouseholdSummary, Receipt } from '../types/receipt';

export interface ArchiveData {
  chapters: StoryChapter[];
  moments: Moment[];
  patterns: Record<string, PatternSignal>;
  constellation: { nodes: ConstellationNode[]; edges: ConstellationEdge[] };
  spotifySummary: SpotifySummary | null;
  transactionSummary: TransactionSummary | null;
  householdSummary: HouseholdSummary | null;
  sampleReceipts: Receipt[];
}

/**
 * Loads all pre-aggregated summaries and metadata asynchronously
 */
export async function loadArchiveData(): Promise<ArchiveData> {
  const fetchJson = async <T>(url: string, fallback: T): Promise<T> => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Failed to fetch ${url}, using fallback`, err);
      return fallback;
    }
  };

  const [
    chapters,
    moments,
    patterns,
    constellation,
    spotifySummary,
    transactionSummary,
    householdSummary,
    sampleReceipts
  ] = await Promise.all([
    fetchJson<StoryChapter[]>('/data/generated/chapters.json', []),
    fetchJson<Moment[]>('/data/generated/moments.json', []),
    fetchJson<Record<string, PatternSignal>>('/data/generated/patterns.json', {}),
    fetchJson<{ nodes: ConstellationNode[]; edges: ConstellationEdge[] }>('/data/generated/constellation.json', { nodes: [], edges: [] }),
    fetchJson<SpotifySummary | null>('/data/generated/spotify-summary.json', null),
    fetchJson<TransactionSummary | null>('/data/generated/transaction-summary.json', null),
    fetchJson<HouseholdSummary | null>('/data/generated/household-summary.json', null),
    fetchJson<Receipt[]>('/data/generated/sample-receipts.json', [])
  ]);

  return {
    chapters,
    moments,
    patterns,
    constellation,
    spotifySummary,
    transactionSummary,
    householdSummary,
    sampleReceipts
  };
}
