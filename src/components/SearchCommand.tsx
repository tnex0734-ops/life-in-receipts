import React, { useState, useEffect, useMemo } from 'react';
import { Receipt } from '../types/receipt';
import { Moment, StoryChapter } from '../types/story';
import { Search, X, Music, Sparkles, Bookmark, ArrowRight, CornerDownLeft } from 'lucide-react';
import { formatDate } from '../data/normalize';

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: Receipt[];
  moments: Moment[];
  chapters: StoryChapter[];
  onSelectReceipt: (receipt: Receipt) => void;
  onSelectMoment: (moment: Moment) => void;
  onSelectChapter: (chapter: StoryChapter) => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({
  isOpen,
  onClose,
  receipts,
  moments,
  chapters,
  onSelectReceipt,
  onSelectMoment,
  onSelectChapter
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Grouped search results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { chapters: [], moments: [], receipts: [] };

    const matchedChapters = chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.signals.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedMoments = moments.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.narrative.toLowerCase().includes(q) ||
        m.receipts.some((r) => r.title.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedReceipts = receipts.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.album?.toLowerCase().includes(q)
    ).slice(0, 8);

    return { chapters: matchedChapters, moments: matchedMoments, receipts: matchedReceipts };
  }, [query, chapters, moments, receipts]);

  if (!isOpen) return null;

  const totalResults = results.chapters.length + results.moments.length + results.receipts.length;

  return (
    <div className="overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Global Archive Search">
      <div
        className="paper-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--bg-paper)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '6px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-paper)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <Search size={20} color="var(--accent-orange)" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archive (e.g. Beatles, Netflix, food, late night, 2018)..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1.125rem',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ minHeight: '30px', minWidth: '30px', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
          {query.trim() === '' ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Type a keyword to search across music history, connected moments, and life chapters.
            </div>
          ) : totalResults === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No matches found for "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Chapters matches */}
              {results.chapters.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Chapters ({results.chapters.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {results.chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onSelectChapter(ch);
                          onClose();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.75rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-paper)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Bookmark size={15} color="var(--accent-orange)" />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{ch.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{ch.startDate} — {ch.endDate}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Moments matches */}
              {results.moments.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Connected Moments ({results.moments.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {results.moments.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectMoment(m);
                          onClose();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.75rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-paper)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Sparkles size={15} color="var(--accent-teal)" />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{m.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{formatDate(m.date)}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Receipts matches */}
              {results.receipts.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-navy)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Receipts ({results.receipts.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {results.receipts.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSelectReceipt(r);
                          onClose();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.75rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-paper)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{r.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {r.subtitle || r.category} • {formatDate(r.timestamp)}
                          </div>
                        </div>
                        <span className="kbd-badge">Trace</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ borderTop: '1px solid var(--border-paper)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd className="kbd-badge">Esc</kbd> to close</span>
            <span><kbd className="kbd-badge">Ctrl+K</kbd> to toggle</span>
          </div>
          <span>Archive Memory Engine</span>
        </div>
      </div>
    </div>
  );
};
