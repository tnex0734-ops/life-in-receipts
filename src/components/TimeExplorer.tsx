import React from 'react';
import { Clock, Filter } from 'lucide-react';

interface TimeExplorerProps {
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
}

interface YearDensity {
  year: string;
  label: string;
  density: number; // 0 to 100
  sources: string[];
  era: string;
}

const YEAR_DATA: YearDensity[] = [
  { year: '2013', label: '2013', density: 25, sources: ['spotify'], era: 'Web player & discovery' },
  { year: '2014', label: '2014', density: 35, sources: ['spotify'], era: 'Indie exploration' },
  { year: '2015', label: '2015', density: 60, sources: ['spotify', 'household'], era: 'Commute & household start' },
  { year: '2016', label: '2016', density: 75, sources: ['spotify', 'household'], era: 'Train transit & routine' },
  { year: '2017', label: '2017', density: 85, sources: ['spotify', 'household'], era: 'Mobile streaming peak' },
  { year: '2018', label: '2018', density: 90, sources: ['spotify', 'household'], era: 'Household & album marathons' },
  { year: '2019', label: '2019', density: 70, sources: ['spotify'], era: 'The Beatles & late night' },
  { year: '2020', label: '2020', density: 65, sources: ['spotify'], era: 'Quiet months & home focus' },
  { year: '2021', label: '2021', density: 68, sources: ['spotify'], era: 'The Strokes & reflection' },
  { year: '2022', label: '2022', density: 80, sources: ['spotify', 'transaction'], era: 'Multi-facet card spending' },
  { year: '2023', label: '2023', density: 98, sources: ['spotify', 'transaction'], era: 'Travel & entertainment burst' },
  { year: '2024', label: '2024', density: 88, sources: ['spotify', 'transaction'], era: 'Modern lifestyle canvas' }
];

export const TimeExplorer: React.FC<TimeExplorerProps> = ({ selectedYear, onSelectYear }) => {
  return (
    <section className="time-explorer paper-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Clock size={14} />
            <span>Activity River • 2013 — 2024</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>
            Archival Density & Temporal Shifts
          </h2>
        </div>

        {selectedYear && (
          <button
            onClick={() => onSelectYear(null)}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-paper)',
              borderRadius: '4px',
              color: 'var(--accent-orange)'
            }}
          >
            <Filter size={12} />
            <span>Clear Year Filter ({selectedYear})</span>
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Height represents receipt concentration across sources. Click any period to focus the entire archive.
      </p>

      {/* Activity River Bars */}
      <div
        role="region"
        aria-label="Activity River density chart"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '0.35rem',
          alignItems: 'flex-end',
          height: '130px',
          padding: '0.5rem 0',
          borderBottom: '1px solid var(--border-paper)'
        }}
      >
        {YEAR_DATA.map((item) => {
          const isSelected = selectedYear === item.year;
          const hasMultipleSources = item.sources.length > 1;

          return (
            <button
              key={item.year}
              onClick={() => onSelectYear(isSelected ? null : item.year)}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                position: 'relative'
              }}
              aria-label={`${item.year}: ${item.density}% activity density, ${item.era}`}
              aria-pressed={isSelected}
            >
              {/* Top dot if cross-source */}
              {hasMultipleSources && (
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)',
                    marginBottom: '4px'
                  }}
                  title="Cross-source convergence"
                />
              )}

              {/* Density Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${item.density}%`,
                  backgroundColor: isSelected
                    ? 'var(--accent-orange)'
                    : hasMultipleSources
                    ? 'var(--accent-teal)'
                    : 'var(--border-dashed)',
                  borderRadius: '2px 2px 0 0',
                  transition: 'all var(--transition-fast)'
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Year labels below */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '0.35rem',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}
      >
        {YEAR_DATA.map((item) => (
          <button
            key={item.year}
            onClick={() => onSelectYear(selectedYear === item.year ? null : item.year)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: selectedYear === item.year ? 'var(--accent-orange)' : 'var(--text-muted)',
              fontWeight: selectedYear === item.year ? 700 : 500,
              padding: '0.2rem 0',
              minHeight: '28px'
            }}
          >
            {item.year.slice(2)}
          </button>
        ))}
      </div>
    </section>
  );
};
