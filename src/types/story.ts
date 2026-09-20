import { ReceiptSource, Receipt } from './receipt';

export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  importance: number;
  description: string;
  evidence: Array<{ label: string; value: string }>;
  signals: string[];
  whyThisMatters: {
    observed: string;
    connected: string;
    story: string;
  };
}

export interface Moment {
  id: string;
  date: string;
  title: string;
  narrative: string;
  sources: ReceiptSource[];
  receiptCount: number;
  receipts: Array<{
    id: string;
    source: ReceiptSource;
    timestamp: number;
    timeStr: string;
    title: string;
    subtitle?: string;
    category?: string;
    amount?: number;
    currency?: string;
    mode?: string;
    city?: string;
    album?: string;
  }>;
  whyThisMatters: {
    observed: string;
    connected: string;
    story: string;
  };
}

export interface PatternSignal {
  id: string;
  title: string;
  peakPeriod?: string;
  description: string;
  momentsCount?: number;
  distribution?: Array<{ label?: string; day?: string; count: number; pct: string }>;
  artists?: Array<{ name: string; count: number }>;
  tracks?: Array<{ name: string; count: number }>;
  transactionCategories?: Array<{ name: string; count: number }>;
  householdCategories?: Array<{ name: string; count: number }>;
  evidence: Record<string, string | number>;
}

export interface ConstellationNode {
  id: string;
  label: string;
  category: 'CHAPTER' | 'MUSIC' | 'PURCHASE' | 'HOUSEHOLD' | 'MOMENT' | 'ROUTINE';
  val: number;
  group: number;
  info: string;
  x?: number;
  y?: number;
}

export interface ConstellationEdge {
  source: string;
  target: string;
  type: 'temporal' | 'co-occurrence' | 'recurrence' | 'cross-source';
  label: string;
}

export interface TraceStep {
  fromReceipt: Partial<Receipt>;
  toReceipt: Partial<Receipt>;
  relationType: 'temporal' | 'co-occurrence' | 'recurrence' | 'cross-source';
  explanation: string;
}
