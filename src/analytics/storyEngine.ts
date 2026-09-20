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

const fetchJson = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return fallback;
  }
};

let cachedReceipts: Receipt[] | null = null;

/**
 * Loads the core archive summary data required for initial render (<150KB)
 */
export async function loadCoreArchiveData(): Promise<Omit<ArchiveData, 'sampleReceipts'>> {
  const [
    chapters,
    moments,
    patterns,
    constellation,
    spotifySummary,
    transactionSummary,
    householdSummary
  ] = await Promise.all([
    fetchJson<StoryChapter[]>('/data/generated/chapters.json', []),
    fetchJson<Moment[]>('/data/generated/moments.json', []),
    fetchJson<Record<string, PatternSignal>>('/data/generated/patterns.json', {}),
    fetchJson<{ nodes: ConstellationNode[]; edges: ConstellationEdge[] }>('/data/generated/constellation.json', { nodes: [], edges: [] }),
    fetchJson<SpotifySummary | null>('/data/generated/spotify-summary.json', null),
    fetchJson<TransactionSummary | null>('/data/generated/transaction-summary.json', null),
    fetchJson<HouseholdSummary | null>('/data/generated/household-summary.json', null)
  ]);

  return {
    chapters,
    moments,
    patterns,
    constellation,
    spotifySummary,
    transactionSummary,
    householdSummary
  };
}

/**
 * Lazily loads sample receipts on demand or preloads in the background
 */
export async function loadSampleReceipts(): Promise<Receipt[]> {
  if (cachedReceipts) return cachedReceipts;
  const receipts = await fetchJson<Receipt[]>('/data/generated/sample-receipts.json', []);
  cachedReceipts = receipts;
  return receipts;
}

/**
 * Loads all archive data (backwards compatibility)
 */
export async function loadArchiveData(): Promise<ArchiveData> {
  const [core, sampleReceipts] = await Promise.all([
    loadCoreArchiveData(),
    loadSampleReceipts()
  ]);

  return {
    ...core,
    sampleReceipts
  };
}
