import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "The archive couldn't be loaded.",
  message = 'Check that local data files exist in public/data/ and try again.',
  onRetry
}) => {
  return (
    <div className="paper-card" style={{ maxWidth: '480px', margin: '3rem auto', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-orange-subtle)', borderRadius: '50%', color: 'var(--accent-orange)' }}>
        <AlertCircle size={24} />
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'var(--accent-orange)',
            color: '#FFFFFF',
            fontWeight: 600,
            padding: '0.6rem 1.25rem',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RefreshCw size={14} />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
};
