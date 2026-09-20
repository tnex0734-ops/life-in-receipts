import React, { useEffect } from 'react';
import { Moment, TraceStep } from '../types/story';
import { Receipt } from '../types/receipt';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatTime, formatAmount } from '../data/normalize';
import { buildMomentTrace } from '../analytics/connections';
import { X, Sparkles, ArrowDown, Calendar, CheckCircle2, Link2 } from 'lucide-react';

interface TracePanelProps {
  moment: Moment | null;
  receipt: Receipt | null;
  onClose: () => void;
}

export const TracePanel: React.FC<TracePanelProps> = ({ moment, receipt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!moment && !receipt) return null;

  // If tracing a moment
  const traceSteps: TraceStep[] = moment ? buildMomentTrace(moment) : [];

  return (
    <div className="overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="trace-panel-title">
      <div className="drawer-right" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-paper)', paddingBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
              <Sparkles size={14} />
              <span>Signature Trace • Relationship Path</span>
            </div>
            <h3 id="trace-panel-title" style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              {moment ? moment.title : receipt?.title}
            </h3>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
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

        {/* Narrative / Context */}
        {moment?.narrative && (
          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-paper)', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {moment.narrative}
          </div>
        )}

        {/* Trace Step-by-Step Path */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Connected Relationship Chain ({moment ? moment.receipts.length : 1} nodes)
          </div>

          {moment && traceSteps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {traceSteps.map((step, idx) => (
                <div key={idx}>
                  {/* Origin receipt card */}
                  <div
                    className="paper-card"
                    style={{
                      padding: '0.875rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <SourceBadge source={step.fromReceipt.source!} size="sm" />
                      <div>
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

                  {/* Relationship Connector */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1.5rem',
                      color: 'var(--accent-orange)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <ArrowDown size={14} />
                    <span style={{ background: 'var(--accent-orange-subtle)', padding: '0.2rem 0.5rem', borderRadius: '3px', border: '1px solid var(--accent-orange)' }}>
                      {step.explanation}
                    </span>
                  </div>

                  {/* Destination receipt card on last step */}
                  {idx === traceSteps.length - 1 && (
                    <div
                      className="paper-card"
                      style={{
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-card)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SourceBadge source={step.toReceipt.source!} size="sm" />
                        <div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <SourceBadge source={receipt.source} size="sm" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{receipt.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{receipt.subtitle || receipt.category}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Occurred on {formatDate(receipt.timestamp)} {formatTime(receipt.timestamp)}.
              </div>
            </div>
          ) : null}
        </div>

        {/* Why This Matters Section */}
        {moment?.whyThisMatters && (
          <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '1.5rem', background: 'var(--bg-paper)' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>
              Why This Matters • Verified Context
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>OBSERVED: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{moment.whyThisMatters.observed}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', fontWeight: 600 }}>CONNECTED: </span>
                <span style={{ color: 'var(--text-secondary)' }}>{moment.whyThisMatters.connected}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: 600 }}>STORY: </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{moment.whyThisMatters.story}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
