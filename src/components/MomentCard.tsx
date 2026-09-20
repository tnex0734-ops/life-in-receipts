import React from 'react';
import { Moment } from '../types/story';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatAmount } from '../data/normalize';
import { Calendar, ArrowRight } from 'lucide-react';

interface MomentCardProps {
  moment: Moment;
  onTrace: (moment: Moment) => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({ moment, onTrace }) => {
  return (
    <article
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Calendar size={13} />
            <span>{formatDate(moment.date)}</span>
          </div>
          <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
            {moment.receiptCount} receipts converged
          </span>
        </div>

        <h3 style={{ fontSize: '1.1875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {moment.title}
        </h3>

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

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', background: 'var(--bg-subtle)', padding: '0.6rem 0.75rem', borderRadius: '3px', borderLeft: '2px solid var(--accent-teal)' }}>
          <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>
            Why It Is Interesting
          </div>
          {moment.whyThisMatters?.story || moment.narrative}
        </div>
      </div>

      <button
        onClick={() => onTrace(moment)}
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
};
