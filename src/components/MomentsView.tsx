import React, { useState } from 'react';
import { Moment } from '../types/story';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatAmount } from '../data/normalize';
import { Sparkles, ArrowRight, Calendar, ChevronDown, Clock, HelpCircle } from 'lucide-react';

interface MomentsViewProps {
  moments: Moment[];
  onTraceMoment: (moment: Moment) => void;
  initialLimit?: number;
}

export const MomentsView: React.FC<MomentsViewProps> = ({
  moments,
  onTraceMoment,
  initialLimit = 6
}) => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const filteredMoments = moments.filter((m) => {
    if (filterSource === 'all') return true;
    if (filterSource === 'card') return m.sources.includes('transaction');
    if (filterSource === 'household') return m.sources.includes('household');
    return true;
  });

  const displayedMoments = showAll ? filteredMoments : filteredMoments.slice(0, initialLimit);

  return (
    <section className="moments-view" aria-labelledby="moments-heading" style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Sparkles size={14} />
            <span>Curated Moments • {moments.length} Temporal Convergences</span>
          </div>
          <h2 id="moments-heading" style={{ fontSize: '1.875rem', marginTop: '0.2rem' }}>
            Connected Moments
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '580px', marginTop: '0.25rem' }}>
            Moments feel like pieces of a personal diary—where music, money, and routines happened within the same window.
          </p>
        </div>

        {/* Source Filter Chips */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-paper)' }}>
          <button
            onClick={() => setFilterSource('all')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'all' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '32px'
            }}
          >
            All ({moments.length})
          </button>
          <button
            onClick={() => setFilterSource('card')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'card' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'card' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '32px'
            }}
          >
            Music + Card
          </button>
          <button
            onClick={() => setFilterSource('household')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '3px',
              background: filterSource === 'household' ? 'var(--bg-card)' : 'transparent',
              color: filterSource === 'household' ? 'var(--text-primary)' : 'var(--text-muted)',
              minHeight: '32px'
            }}
          >
            Music + Household
          </button>
        </div>
      </div>

      {/* Diary-like Moments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {displayedMoments.map((moment) => {
          return (
            <article
              key={moment.id}
              className="paper-card"
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* 1. DATE / TIME */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={13} />
                    <span>{formatDate(moment.date)}</span>
                  </div>
                  <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
                    {moment.receiptCount} receipts converged
                  </span>
                </div>

                {/* 2. MOMENT TITLE */}
                <h3 style={{ fontSize: '1.1875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {moment.title}
                </h3>

                {/* 3. CONNECTED RECEIPTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {moment.receipts.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-paper)',
                        padding: '0.45rem 0.65rem',
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
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.title}
                        </span>
                      </div>

                      {r.amount !== undefined && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
                          {formatAmount(r.amount, r.currency)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 4. WHY IT IS INTERESTING */}
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', background: 'var(--bg-subtle)', padding: '0.6rem 0.75rem', borderRadius: '3px', borderLeft: '2px solid var(--accent-teal)' }}>
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>
                    Why It Is Interesting
                  </div>
                  {moment.whyThisMatters?.story || moment.narrative}
                </div>
              </div>

              {/* Action Button: Trace moment */}
              <button
                onClick={() => onTraceMoment(moment)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--accent-orange)',
                  color: 'var(--accent-orange)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                aria-label={`Trace relationships in moment: ${moment.title}`}
              >
                <span>Trace moment</span>
                <ArrowRight size={15} />
              </button>
            </article>
          );
        })}
      </div>

      {/* Progressive Disclosure: Explore all moments */}
      {!showAll && filteredMoments.length > initialLimit && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-paper)',
              padding: '0.6rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Explore all {filteredMoments.length} moments</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </section>
  );
};
