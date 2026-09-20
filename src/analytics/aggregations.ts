import { Receipt } from '../types/receipt';
import { getTimeOfDay } from '../lib/dates';

export interface TimeDistribution {
  morning: number;
  afternoon: number;
  evening: number;
  lateNight: number;
}

export function aggregateTimeOfDay(receipts: Receipt[]): TimeDistribution {
  const dist: TimeDistribution = { morning: 0, afternoon: 0, evening: 0, lateNight: 0 };
  for (const r of receipts) {
    if (!r.timestamp) continue;
    const tod = getTimeOfDay(r.timestamp);
    dist[tod]++;
  }
  return dist;
}

export function aggregateBySource(receipts: Receipt[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of receipts) {
    counts[r.source] = (counts[r.source] || 0) + 1;
  }
  return counts;
}

export function aggregateByCategory(receipts: Receipt[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of receipts) {
    if (!r.category) continue;
    counts[r.category] = (counts[r.category] || 0) + 1;
  }
  return counts;
}
