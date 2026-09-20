import React, { useState } from 'react';
import { Moment } from '../types/story';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatAmount } from '../data/normalize';
import { Sparkles, ArrowRight, Compass, Calendar, Layers } from 'lucide-react';

interface MomentsViewProps {
  moments: Moment[];
  onTraceMoment: (moment: Moment) => void;
}

export const MomentsView: React.FC<MomentsViewProps> = ({ moments, onTraceMoment }) => {
  const [filterSource, setFilterSource] = useState<string>('all');

  const filteredMoments = moments.filter((m) => {
    if (filterSource === 'all') return true;
    if (filterSource === 'card') return m.sources.includes('transaction');
    if (filterSource === 'household') return m.sources.includes('household');
    return true;
  });

  return (
    <section className="moments-view" aria-labelledby="moments-heading" style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Sparkles size={14} />
            <span>Temporal Convergences • {moments.length} Verified Moments</span>
          </div>
          <h2 id="moments-heading" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
            Connected Moments
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '620px', marginTop: '0.35rem' }}>
            Points in time where distinct datasets recorded activity simultaneously. Discover what happened around each receipt.
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-paper)' }}>
          <button
            onClick={() => setFilterSource('all')}
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'all' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '34px'
            }}
          >
            All Convergences ({moments.length})
          </button>
          <button
            onClick={() => setFilterSource('card')}
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'card' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'card' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '34px'
            }}
          >
            Music + Card Spend
          </button>
          <button
            onClick={() => setFilterSource('household')}
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'household' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'household' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '34px'
            }}
          >
            Music + Household
          </button>
        </div>
      </div>

      {/* Moments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredMoments.map((moment) => {
          return (
            <article
              key={moment.id}
              className="paper-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={13} />
                    <span>{formatDate(moment.date)}</span>
                  </div>
                  <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
                    {moment.receiptCount} Receipts Converged
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {moment.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {moment.narrative}
                </p>

                {/* Converged Receipts Snapshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {moment.receipts.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-paper)',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '3px',
                        border: '1px solid var(--border-paper)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <SourceBadge source={r.source} size="sm" />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</span>
                          {r.subtitle && <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>{r.subtitle}</span>}
                        </div>
                      </div>

                      {r.amount !== undefined && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
                          {formatAmount(r.amount, r.currency)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Trace this moment */}
              <button
                onClick={() => onTraceMoment(moment)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--accent-orange)',
                  color: 'var(--accent-orange)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                aria-label={`Trace relationships in moment: ${moment.title}`}
              >
                <span>Trace this moment</span>
                <ArrowRight size={16} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
