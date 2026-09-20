import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing surfaced here yet.',
  message = 'Try another date, source, or search keyword.',
  onAction,
  actionLabel
}) => {
  return (
    <div className="paper-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)', borderRadius: '50%', color: 'var(--accent-orange)' }}>
        <Search size={22} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        {message}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          style={{
            background: 'var(--accent-orange)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '4px'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
