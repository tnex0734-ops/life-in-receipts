import React from 'react';
import { Music, CreditCard, Home } from 'lucide-react';
import { ReceiptSource } from '../types/receipt';

interface SourceBadgeProps {
  source: ReceiptSource;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, size = 'md' }) => {
  if (source === 'spotify') {
    return (
      <span className="badge-source badge-spotify" title="Spotify Listening History">
        <Music size={size === 'sm' ? 12 : 14} />
        <span>Spotify</span>
      </span>
    );
  }

  if (source === 'transaction') {
    return (
      <span className="badge-source badge-transaction" title="Card & Multi-Facet Transaction">
        <CreditCard size={size === 'sm' ? 12 : 14} />
        <span>Card</span>
      </span>
    );
  }

  return (
    <span className="badge-source badge-household" title="Household Transaction & Commute">
      <Home size={size === 'sm' ? 12 : 14} />
      <span>Household</span>
    </span>
  );
};
