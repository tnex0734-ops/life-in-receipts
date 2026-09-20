import { Receipt, ReceiptSource } from '../types/receipt';
import { Moment, TraceStep } from '../types/story';
import { formatDate, formatTime } from '../data/normalize';

export const MOMENT_WINDOW_HOURS = 24;
export const PROXIMITY_WINDOW_HOURS = 3;
export const RECURRING_DAYS_THRESHOLD = 4;

export interface ConnectionExplanation {
  type: 'temporal' | 'co-occurrence' | 'recurrence' | 'cross-source' | 'intensity';
  label: string;
  description: string;
}

/**
 * Evaluates the relationship between two receipts without asserting unsupported causality
 */
export function explainRelationship(a: Partial<Receipt>, b: Partial<Receipt>): ConnectionExplanation {
  const timeA = a.timestamp || 0;
  const timeB = b.timestamp || 0;
  const diffMs = Math.abs(timeA - timeB);
  const diffHours = diffMs / (1000 * 60 * 60);

  // 1. Cross-Source & Proximity
  if (a.source !== b.source && diffHours <= PROXIMITY_WINDOW_HOURS) {
    return {
      type: 'cross-source',
      label: 'Within 3 Hours',
      description: `${a.source} and ${b.source} events converged within ${diffHours.toFixed(1)} hours.`
    };
  }

  // 2. Same Day Temporal
  if (diffHours <= 24) {
    const isCrossSource = a.source !== b.source;
    return {
      type: isCrossSource ? 'cross-source' : 'temporal',
      label: 'Same Day Window',
      description: isCrossSource
        ? `Different life traces (${a.source} and ${b.source}) took place on the same calendar day.`
        : `Sequential activity recorded within the same 24-hour cycle.`
    };
  }

  // 3. Categorical Co-occurrence
  if (a.category && b.category && a.category.toLowerCase() === b.category.toLowerCase()) {
    return {
      type: 'co-occurrence',
      label: 'Shared Category',
      description: `Both receipts share the "${a.category}" category across different periods.`
    };
  }

  // 4. Recurrence (Same Weekday or Routine)
  const dayA = new Date(timeA).getDay();
  const dayB = new Date(timeB).getDay();
  if (dayA === dayB) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      type: 'recurrence',
      label: `Recurring ${days[dayA]}`,
      description: `Both events took place on a ${days[dayA]}, forming part of a repeating weekly pattern.`
    };
  }

  return {
    type: 'intensity',
    label: 'Archival Thread',
    description: `Connected through shared archival timeline.`
  };
}

/**
 * Builds a trace thread from a moment's receipts
 */
export function buildMomentTrace(moment: Moment): TraceStep[] {
  const steps: TraceStep[] = [];
  const receipts = moment.receipts;
  if (!receipts || receipts.length < 2) return steps;

  for (let i = 0; i < receipts.length - 1; i++) {
    const cur = receipts[i];
    const next = receipts[i + 1];
    const rel = explainRelationship(cur, next);
    steps.push({
      fromReceipt: cur,
      toReceipt: next,
      relationType: rel.type === 'intensity' ? 'temporal' : rel.type,
      explanation: rel.description
    });
  }

  return steps;
}
