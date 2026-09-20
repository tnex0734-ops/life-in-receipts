import React from 'react';
import { PatternSignal } from '../types/story';
import { CheckCircle2 } from 'lucide-react';

interface PatternCardProps {
  pattern: PatternSignal;
  icon?: React.ReactNode;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern, icon }) => {
  return (
    <div className="paper-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)' }}>
          {icon}
          <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{pattern.title}</span>
        </div>
        {pattern.peakPeriod && (
          <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
            {pattern.peakPeriod}
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        {pattern.description}
      </p>

      {pattern.evidence && (
        <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={13} color="var(--accent-teal)" />
          <span>Evidence: {String(pattern.evidence.confidence || 'Empirical signal')}</span>
        </div>
      )}
    </div>
  );
};
