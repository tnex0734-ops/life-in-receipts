import { Receipt } from '../types/receipt';
import { Moment } from '../types/story';
import { MOMENT_WINDOW_HOURS } from '../lib/constants';
import { formatDate } from '../lib/dates';

export function clusterReceiptsByDate(receipts: Receipt[]): Map<string, Receipt[]> {
  const map = new Map<string, Receipt[]>();
  for (const r of receipts) {
    if (!r.timestamp) continue;
    const dateKey = new Date(r.timestamp).toISOString().slice(0, 10);
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(r);
  }
  return map;
}

export function detectConvergentMoments(receipts: Receipt[]): Moment[] {
  const byDate = clusterReceiptsByDate(receipts);
  const moments: Moment[] = [];

  for (const [dateKey, dayReceipts] of byDate.entries()) {
    const sources = Array.from(new Set(dayReceipts.map((r) => r.source)));
    if (sources.length >= 2) {
      moments.push({
        id: `moment-${dateKey}`,
        date: dateKey,
        title: `${sources.join(' & ')} Convergence`,
        narrative: `Activity recorded across multiple life streams on ${formatDate(dateKey)}.`,
        sources,
        receiptCount: dayReceipts.length,
        receipts: dayReceipts.slice(0, 8) as any,
        whyThisMatters: {
          observed: `${dayReceipts.length} receipts occurred on the same day.`,
          connected: `Traces from ${sources.join(' and ')} overlapped.`,
          story: `A day where distinct routines met.`
        }
      });
    }
  }

  return moments.sort((a, b) => b.receiptCount - a.receiptCount);
}
