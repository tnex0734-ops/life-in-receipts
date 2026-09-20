import React, { useState } from 'react';
import { StoryChapter } from '../types/story';
import { Bookmark, ChevronRight, Eye, Link2, Sparkles, ArrowUpRight } from 'lucide-react';

interface ChapterViewProps {
  chapters: StoryChapter[];
  selectedYear: string | null;
  onSelectChapter: (chapter: StoryChapter) => void;
  onViewEvidence: (chapter: StoryChapter) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapters,
  selectedYear,
  onSelectChapter,
  onViewEvidence
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(chapters[0]?.id || 'chapter-1');

  // Filter chapters if selectedYear is active
  const filteredChapters = selectedYear
    ? chapters.filter((c) => {
        const start = parseInt(c.startDate.slice(0, 4), 10);
        const end = parseInt(c.endDate.slice(0, 4), 10);
        const yr = parseInt(selectedYear, 10);
        return yr >= start && yr <= end;
      })
    : chapters;

  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  if (!currentChapter) {
    return null;
  }

  return (
    <section className="chapter-experience" aria-labelledby="chapters-title" style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Bookmark size={14} />
            <span>Story Engine • 5 Data-Synthesized Eras</span>
          </div>
          <h2 id="chapters-title" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
            The Living Chapters
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '480px' }}>
          Formed through temporal density shifts, recurring routines, and multi-source co-occurrences.
        </p>
      </div>

      {/* Chapter Selection Bar */}
      <div
        role="tablist"
        aria-label="Story Chapters"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {filteredChapters.map((ch, idx) => {
          const isActive = ch.id === activeChapterId;
          return (
            <button
              key={ch.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`chapter-panel-${ch.id}`}
              id={`chapter-tab-${ch.id}`}
              onClick={() => {
                setActiveChapterId(ch.id);
                onSelectChapter(ch);
              }}
              className="paper-card"
              style={{
                textAlign: 'left',
                padding: '0.875rem 1rem',
                borderLeft: isActive ? '3px solid var(--accent-orange)' : '1px solid var(--border-paper)',
                background: isActive ? 'var(--bg-paper)' : 'var(--bg-card)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                Chapter 0{idx + 1} • {ch.startDate} to {ch.endDate}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Featured Active Chapter Detailed Panel */}
      <div
        id={`chapter-panel-${currentChapter.id}`}
        role="tabpanel"
        aria-labelledby={`chapter-tab-${currentChapter.id}`}
        className="paper-card"
        style={{
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Editorial Masthead of Chapter */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-paper)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="receipt-stamp stamp-teal">
                {currentChapter.startDate} — {currentChapter.endDate}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Importance: {(currentChapter.importance * 100).toFixed(0)}%
              </span>
            </div>
            <h3 style={{ fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              {currentChapter.title}
            </h3>
            <p style={{ fontSize: '1.125rem', color: 'var(--accent-teal)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              {currentChapter.subtitle}
            </p>
          </div>

          <button
            onClick={() => onViewEvidence(currentChapter)}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-paper)',
              padding: '0.6rem 1.2rem',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--text-primary)'
            }}
          >
            <span>View Chapter Receipts</span>
            <ArrowUpRight size={16} color="var(--accent-orange)" />
          </button>
        </div>

        {/* Narrative Description */}
        <div style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '820px' }}>
          {currentChapter.description}
        </div>

        {/* Chapter Signals & Evidence Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '4px', border: '1px solid var(--border-paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Eye size={14} color="var(--accent-teal)" />
              <span>Direct Evidence</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentChapter.evidence.map((ev, i) => (
                <div key={i} style={{ fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.label}: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{ev.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '4px', border: '1px solid var(--border-paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Sparkles size={14} color="var(--accent-orange)" />
              <span>Detected Signals</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {currentChapter.signals.map((sig, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-paper)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    color: 'var(--text-primary)'
                  }}
                >
                  {sig}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* "Why This Matters" Micro-Narrative: Observed -> Connected -> Story */}
        <div
          style={{
            borderTop: '1px dashed var(--border-dashed)',
            paddingTop: '1.5rem',
            background: 'var(--bg-paper)',
            padding: '1.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-paper)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.04em' }}>
            Why This Matters • Grounded Synthesis
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                [ 01. Observed ]
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {currentChapter.whyThisMatters.observed}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                [ 02. Connected ]
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {currentChapter.whyThisMatters.connected}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                [ 03. Story ]
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
                {currentChapter.whyThisMatters.story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
