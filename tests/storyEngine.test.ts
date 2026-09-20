import { describe, it, expect } from 'vitest';
import { StoryChapter } from '../src/types/story';

// Validation helper for story chapters
export function validateChapter(chapter: StoryChapter): boolean {
  if (!chapter.id || !chapter.title || !chapter.description) return false;
  if (!chapter.startDate || !chapter.endDate) return false;
  if (typeof chapter.importance !== 'number' || chapter.importance < 0 || chapter.importance > 1) return false;
  if (!Array.isArray(chapter.evidence) || chapter.evidence.length === 0) return false;
  if (!chapter.whyThisMatters?.observed || !chapter.whyThisMatters?.connected || !chapter.whyThisMatters?.story) return false;
  return true;
}

export function synthesizeChapters(rawChapters: StoryChapter[]): StoryChapter[] {
  if (!rawChapters || rawChapters.length === 0) {
    return [];
  }
  // Sort deterministically by start date
  return [...rawChapters].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

describe('Story Generation Engine', () => {
  const sampleChapter: StoryChapter = {
    id: 'chapter-1',
    title: 'The First Tracks',
    subtitle: 'The Web Player & Discovery Era',
    startDate: '2013-07',
    endDate: '2015-01',
    importance: 0.82,
    description: 'The earliest digital footprint begins in July 2013 on desktop and web player.',
    evidence: [
      { label: 'Platform', value: 'Web player & Windows dominance' },
      { label: 'Session Volume', value: '6,420 tracks recorded' }
    ],
    signals: ['Early Desktop Era', 'Continuous Playlists'],
    whyThisMatters: {
      observed: 'Listening took place almost exclusively through web browsers.',
      connected: 'No mobile or financial records existed in this archive during this timeframe.',
      story: 'The initial archival footprint is personal and focused purely on digital music discovery.'
    }
  };

  it('validates complete story chapter structure', () => {
    expect(validateChapter(sampleChapter)).toBe(true);
  });

  it('rejects chapters with missing whyThisMatters narratives', () => {
    const invalid = { ...sampleChapter, whyThisMatters: undefined as any };
    expect(validateChapter(invalid)).toBe(false);
  });

  it('rejects chapters with empty evidence array', () => {
    const invalid = { ...sampleChapter, evidence: [] };
    expect(validateChapter(invalid)).toBe(false);
  });

  it('returns empty array on empty input without throwing', () => {
    expect(synthesizeChapters([])).toEqual([]);
    expect(synthesizeChapters(null as any)).toEqual([]);
  });

  it('produces deterministic, chronologically sorted chapters', () => {
    const ch2: StoryChapter = {
      ...sampleChapter,
      id: 'chapter-2',
      startDate: '2015-01',
      endDate: '2018-09'
    };
    const ch3: StoryChapter = {
      ...sampleChapter,
      id: 'chapter-3',
      startDate: '2018-10',
      endDate: '2020-03'
    };

    const sorted = synthesizeChapters([ch3, sampleChapter, ch2]);
    expect(sorted[0].id).toBe('chapter-1');
    expect(sorted[1].id).toBe('chapter-2');
    expect(sorted[2].id).toBe('chapter-3');
  });
});
