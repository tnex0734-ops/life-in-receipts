import React, { useEffect } from 'react';
import { Moment, TraceStep } from '../types/story';
import { Receipt } from '../types/receipt';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatTime, formatAmount } from '../data/normalize';
import { buildMomentTrace } from '../analytics/connections';
import { X, Sparkles, ArrowDown, ArrowRight, Calendar, Layers, Clock } from 'lucide-react';

interface TracePanelProps {
  moment: Moment | null;
  receipt: Receipt | null;
  onClose: () => void;
  onViewReceipts?: () => void;
}

export const TracePanel: React.FC<TracePanelProps> = ({
  moment,
  receipt,
  onClose,
  onViewReceipts
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!moment && !receipt) return null;

  const traceSteps: TraceStep[] = moment ? buildMomentTrace(moment) : [];

  return (
    <div className="overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="trace-panel-title">
      <div
        className="drawer-right"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-paper)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
                <Sparkles size={14} />
                <span>Signature Trace • Connecting The Dots</span>
              </div>
              <h3 id="trace-panel-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', lineHeight: 1.2 }}>
                {moment ? moment.title : receipt?.title}
              </h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                {moment ? formatDate(moment.date) : formatDate(receipt?.timestamp)}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                minHeight: '36px',
                minWidth: '36px',
                borderRadius: '4px',
                border: '1px solid var(--border-paper)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)'
              }}
              aria-label="Close trace panel"
            >
              <X size={18} />
            </button>
          </div>

          {/* Connection Overview Banner */}
          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-paper)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
              Why They Connect
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <span>✓ Same calendar date</span>
              <span>✓ Within activity window</span>
              <span>✓ Shared life routine</span>
            </div>
          </div>

          {/* Visual Step-by-Step Connection Path */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Connection Path ({moment ? moment.receipts.length : 1} Traces)
            </div>

            {moment && traceSteps.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {traceSteps.map((step, idx) => (
                  <div key={idx}>
                    {/* Source Node */}
                    <div
                      className="paper-card"
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-card)',
                        borderLeft: '3px solid var(--accent-orange)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                        <SourceBadge source={step.fromReceipt.source!} size="sm" />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {step.fromReceipt.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {step.fromReceipt.subtitle || step.fromReceipt.category}
                          </div>
                        </div>
                      </div>

                      {step.fromReceipt.amount !== undefined && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
                          {formatAmount(step.fromReceipt.amount, step.fromReceipt.currency)}
                        </div>
                      )}
                    </div>

                    {/* Step Linker */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        color: 'var(--accent-orange)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <ArrowDown size={14} />
                      <span style={{ background: 'var(--accent-orange-subtle)', padding: '0.15rem 0.5rem', borderRadius: '3px', border: '1px solid var(--accent-orange)' }}>
                        {step.explanation}
                      </span>
                    </div>

                    {/* Last destination node */}
                    {idx === traceSteps.length - 1 && (
                      <div
                        className="paper-card"
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-card)',
                          borderLeft: '3px solid var(--accent-teal)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <SourceBadge source={step.toReceipt.source!} size="sm" />
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                              {step.toReceipt.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {step.toReceipt.subtitle || step.toReceipt.category}
                            </div>
                          </div>
                        </div>

                        {step.toReceipt.amount !== undefined && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
                            {formatAmount(step.toReceipt.amount, step.toReceipt.currency)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : receipt ? (
              <div className="paper-card" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <SourceBadge source={receipt.source} size="sm" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{receipt.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{receipt.subtitle || receipt.category}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Recorded on {formatDate(receipt.timestamp)} {formatTime(receipt.timestamp)}.
                </div>
              </div>
            ) : null}
          </div>

          {/* Narrative Grounding */}
          {moment?.whyThisMatters && (
            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>
                Editorial Narrative
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {moment.whyThisMatters.story}
              </p>
            </div>
          )}
        </div>

        {/* Footer Action: View the receipts */}
        {onViewReceipts && (
          <div style={{ borderTop: '1px solid var(--border-paper)', paddingTop: '1.25rem', marginTop: '1rem' }}>
            <button
              onClick={() => {
                onClose();
                onViewReceipts();
              }}
              style={{
                width: '100%',
                background: 'var(--accent-orange)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Layers size={16} />
              <span>View the receipts in explorer</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
