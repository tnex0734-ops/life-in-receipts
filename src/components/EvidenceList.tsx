import React from 'react';
import { Eye } from 'lucide-react';

interface EvidenceItem {
  label: string;
  value: string;
}

interface EvidenceListProps {
  items: EvidenceItem[];
  title?: string;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ items, title = 'Direct Evidence' }) => {
  return (
    <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '4px', border: '1px solid var(--border-paper)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        <Eye size={14} color="var(--accent-teal)" />
        <span>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((ev, i) => (
          <div key={i} style={{ fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.label}: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{ev.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
