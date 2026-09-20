import React from 'react';
import { Sparkles, ArrowRight, Moon, CheckCircle2 } from 'lucide-react';
import { PatternSignal } from '../types/story';

interface FeaturedInsightProps {
  rhythmsPattern?: PatternSignal;
  onTrace: () => void;
}

export const FeaturedInsight: React.FC<FeaturedInsightProps> = ({ rhythmsPattern, onTrace }) => {
  const peakPeriod = rhythmsPattern?.peakPeriod || '11 PM — 2 AM';
  const sessionsCount = '27,618';
  const percentage = '18.4%';

  return (
    <section
      className="featured-insight-section"
      aria-labelledby="featured-insight-title"
      style={{
        marginBottom: '4rem',
        marginTop: '1rem'
      }}
    >
      <div
        className="paper-card"
        style={{
          padding: 'clamp(1.75rem, 4vw, 3rem)',
          borderLeft: '4px solid var(--accent-orange)',
          background: 'linear-gradient(135deg, var(--bg-paper) 0%, #FAF5EE 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              A Pattern Emerged
            </span>
            <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Core Discovery • 2013 — 2024
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-teal)' }}>
            <CheckCircle2 size={14} />
            <span>High Confidence Signal</span>
          </div>
        </div>

        {/* Big Narrative Headline */}
        <h2
          id="featured-insight-title"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            maxWidth: '780px'
          }}
        >
          Late-night listening became a recurring ritual.
        </h2>

        {/* Narrative Description */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '720px',
            marginBottom: '2rem'
          }}
        >
          Between 11 PM and 2 AM, listening volume consistently surged across 11 years. Rather than scattered plays, these tracks clustered into deep album marathons with low skip rates, forming an unmistakable nightly cadence.
        </p>

        {/* Evidence Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.25rem',
            padding: '1.25rem 0',
            borderTop: '1px dashed var(--border-dashed)',
            borderBottom: '1px dashed var(--border-dashed)',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Peak Window
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
              {peakPeriod}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Midnight density spike</div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Late-Night Plays
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {sessionsCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified streams</div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Archive Share
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>
              {percentage}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Of all lifetime music</div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Consistency
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              14 Weeks
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Repeated consecutive streaks</div>
          </div>
        </div>

        {/* Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onTrace}
            style={{
              background: 'var(--accent-orange)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              boxShadow: 'var(--shadow-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
            aria-label="Trace this late-night listening pattern"
          >
            <Sparkles size={16} />
            <span>Trace this pattern</span>
            <ArrowRight size={16} />
          </button>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Follow the thread to see connected midnight receipts
          </span>
        </div>
      </div>
    </section>
  );
};
