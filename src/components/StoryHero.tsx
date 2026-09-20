import React from 'react';
import { ArrowRight, Compass, Sparkles, Layers, Activity, Calendar } from 'lucide-react';

interface StoryHeroProps {
  onExplore: () => void;
  onSeePatterns: () => void;
  stats: {
    totalReceipts: number;
    yearsSpan: string;
    momentsCount: number;
    chaptersCount: number;
  };
}

export const StoryHero: React.FC<StoryHeroProps> = ({
  onExplore,
  onSeePatterns,
  stats
}) => {
  return (
    <section className="hero-section" aria-labelledby="hero-title" style={{ padding: '3.5rem 0 2.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="receipt-stamp stamp-orange">
            Personal Life Archive
          </span>
          <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            2013 — 2024
          </span>
        </div>

        <h1
          id="hero-title"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}
        >
          Your life leaves traces.<br />
          <span style={{ color: 'var(--accent-orange)' }}>We turned them into a story.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}
        >
          Thousands of small moments. Music. Money. Routines. Repetition.<br />
          Start connecting the dots.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button
            onClick={onExplore}
            style={{
              background: 'var(--accent-orange)',
              color: '#FFFFFF',
              fontWeight: 600,
              padding: '0.75rem 1.75rem',
              borderRadius: '4px',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)'
            }}
            aria-label="Start exploring the story chapters"
          >
            <span>Start exploring</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onSeePatterns}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-paper)',
              fontWeight: 600,
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            aria-label="Jump to discovered patterns view"
          >
            <Compass size={18} color="var(--accent-teal)" />
            <span>See the patterns</span>
          </button>
        </div>

        {/* The Big Picture Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-paper)',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid var(--border-paper)',
            textAlign: 'left'
          }}
        >
          <div style={{ borderRight: '1px dashed var(--border-dashed)', paddingRight: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Calendar size={14} />
              <span>Timeline</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              11+ Years
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>2013 — 2024 traces</div>
          </div>

          <div style={{ borderRight: '1px dashed var(--border-dashed)', paddingRight: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Layers size={14} />
              <span>Total Receipts</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {stats.totalReceipts.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Music, Card, Household</div>
          </div>

          <div style={{ borderRight: '1px dashed var(--border-dashed)', paddingRight: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Sparkles size={14} color="var(--accent-orange)" />
              <span>Convergences</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
              {stats.momentsCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Multi-source moments</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Activity size={14} color="var(--accent-teal)" />
              <span>Story Chapters</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
              {stats.chaptersCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Data-synthesized eras</div>
          </div>
        </div>
      </div>
    </section>
  );
};
