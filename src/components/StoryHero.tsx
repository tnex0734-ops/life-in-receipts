import React from 'react';
import { ArrowRight, Compass, Sparkles, Layers, Activity, Calendar, Music, CreditCard } from 'lucide-react';

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
    <section className="hero-section" aria-labelledby="hero-title" style={{ padding: '3.5rem 0 2rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="receipt-stamp stamp-orange">
            Digital Life Archive
          </span>
          <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            2013 — 2024
          </span>
        </div>

        {/* Refined Editorial Headline */}
        <h1
          id="hero-title"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}
        >
          Thousands of moments.<br />
          <span style={{ color: 'var(--accent-orange)' }}>One life.</span>
        </h1>

        {/* Supporting Editorial Copy */}
        <p
          style={{
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}
        >
          Music. Purchases. Places. Routines.<br />
          Discover what happens when the fragments connect.
        </p>

        {/* CTAs */}
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
            aria-label="Explore the story chapters"
          >
            <span>Explore the story</span>
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
            <span>Find a pattern</span>
          </button>
        </div>

        {/* 3–4 High-Value Generated Statistics (No chart clutter) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.25rem',
            background: 'var(--bg-paper)',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid var(--border-paper)',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              149K
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Music Receipts
            </div>
          </div>

          <div style={{ borderLeft: '1px dashed var(--border-dashed)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              10K+
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Transactions
            </div>
          </div>

          <div style={{ borderLeft: '1px dashed var(--border-dashed)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {stats.momentsCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Connected Moments
            </div>
          </div>

          <div style={{ borderLeft: '1px dashed var(--border-dashed)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {stats.chaptersCount}
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Story Chapters
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
