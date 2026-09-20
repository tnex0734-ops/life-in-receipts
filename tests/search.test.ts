import { describe, it, expect } from 'vitest';
import { Receipt } from '../src/types/receipt';

// Search filter helper mirroring client logic
export function filterReceipts(
  receipts: Receipt[],
  query: string,
  source: string = 'all'
): Receipt[] {
  const q = query.toLowerCase().trim();
  return receipts.filter((r) => {
    if (source !== 'all' && r.source !== source) return false;
    if (!q) return true;

    const matchTitle = r.title.toLowerCase().includes(q);
    const matchSubtitle = r.subtitle?.toLowerCase().includes(q);
    const matchCategory = r.category?.toLowerCase().includes(q);
    const matchAlbum = r.album?.toLowerCase().includes(q);
    const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));

    return Boolean(matchTitle || matchSubtitle || matchCategory || matchAlbum || matchTags);
  });
}

describe('Search & Filter Engine', () => {
  const mockReceipts: Receipt[] = [
    {
      id: 'sp-1',
      source: 'spotify',
      timestamp: 1692043200000,
      dateStr: '2023-08-14',
      title: 'Here Comes The Sun',
      subtitle: 'The Beatles',
      category: 'Music',
      album: 'Abbey Road',
      tags: ['android', 'completed']
    },
    {
      id: 'tx-1',
      source: 'transaction',
      timestamp: 1692046800000,
      dateStr: '2023-08-14',
      title: 'PVR Cinemas',
      subtitle: 'entertainment • Mumbai',
      category: 'entertainment',
      amount: 450,
      tags: ['entertainment', 'Mumbai']
    },
    {
      id: 'hh-1',
      source: 'household',
      timestamp: 1537444800000,
      dateStr: '2018-09-20',
      title: 'Train Ticket',
      subtitle: 'Transportation • Train',
      category: 'Transportation',
      amount: 30,
      tags: ['Cash', 'Expense']
    }
  ];

  it('performs exact match searches across titles and artists', () => {
    const results = filterReceipts(mockReceipts, 'The Beatles');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Here Comes The Sun');
  });

  it('performs partial case-insensitive search', () => {
    const results = filterReceipts(mockReceipts, 'beatles');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('sp-1');
  });

  it('searches across categories and tags', () => {
    const results = filterReceipts(mockReceipts, 'entertainment');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('tx-1');
  });

  it('returns empty array when no records match', () => {
    const results = filterReceipts(mockReceipts, 'nonexistent query xyz');
    expect(results.length).toBe(0);
  });

  it('filters by source correctly', () => {
    const musicOnly = filterReceipts(mockReceipts, '', 'spotify');
    expect(musicOnly.length).toBe(1);
    expect(musicOnly[0].source).toBe('spotify');

    const cardOnly = filterReceipts(mockReceipts, '', 'transaction');
    expect(cardOnly.length).toBe(1);
    expect(cardOnly[0].source).toBe('transaction');
  });

  it('returns all receipts on empty query and all source', () => {
    const all = filterReceipts(mockReceipts, '', 'all');
    expect(all.length).toBe(3);
  });
});
