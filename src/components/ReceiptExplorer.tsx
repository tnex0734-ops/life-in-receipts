import React, { useState, useMemo } from 'react';
import { Receipt, ReceiptSource } from '../types/receipt';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatTime, formatDuration, formatAmount, getTimeOfDay } from '../data/normalize';
import { Search, ChevronLeft, ChevronRight, Sparkles, X, Clock } from 'lucide-react';

interface ReceiptExplorerProps {
  receipts: Receipt[];
  initialQuery?: string;
  onTraceReceipt?: (receipt: Receipt) => void;
}

export const ReceiptExplorer: React.FC<ReceiptExplorerProps> = ({
  receipts,
  initialQuery = '',
  onTraceReceipt
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Filter & Search
  const filteredReceipts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return receipts.filter((r) => {
      // Source filter: all, spotify (music), transaction (purchases), household
      if (selectedSource === 'music' && r.source !== 'spotify') return false;
      if (selectedSource === 'purchases' && r.source !== 'transaction') return false;
      if (selectedSource === 'household' && r.source !== 'household') return false;

      // Time of day filter
      if (selectedTimeOfDay !== 'all' && r.timestamp) {
        const tod = getTimeOfDay(r.timestamp);
        if (tod !== selectedTimeOfDay) return false;
      }

      // Text query
      if (q) {
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchSubtitle = r.subtitle?.toLowerCase().includes(q);
        const matchCategory = r.category?.toLowerCase().includes(q);
        const matchAlbum = r.album?.toLowerCase().includes(q);
        const matchDate = formatDate(r.timestamp).toLowerCase().includes(q);
        const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSubtitle && !matchCategory && !matchAlbum && !matchDate && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [receipts, searchQuery, selectedSource, selectedTimeOfDay]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredReceipts.length / pageSize));
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage, pageSize]);

  return (
    <section className="receipt-explorer" aria-labelledby="receipts-heading" style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
          <Search size={14} />
          <span>Smart Exploration • {filteredReceipts.length.toLocaleString()} Traces</span>
        </div>
        <h2 id="receipts-heading" style={{ fontSize: '1.875rem', marginTop: '0.2rem' }}>
          Life Receipts
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '580px', marginTop: '0.25rem' }}>
          Search across 11 years of music streams, card purchases, and daily notes.
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-orange)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search your receipts (e.g. The Beatles, food, late night, 2023, entertainment)..."
          style={{
            width: '100%',
            padding: '0.85rem 1rem 0.85rem 2.85rem',
            fontSize: '1rem',
            border: '1.5px solid var(--border-paper)',
            borderRadius: '6px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', minHeight: '32px', minWidth: '32px', color: 'var(--text-muted)' }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Simplified High-UX-Value Filters (Horizontal Bar / Scrollable Chips) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          background: 'var(--bg-paper)',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--border-paper)'
        }}
      >
        {/* Source Filter Chips */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'all', label: 'All Receipts' },
            { id: 'music', label: 'Music' },
            { id: 'purchases', label: 'Purchases' },
            { id: 'household', label: 'Household' }
          ].map((chip) => {
            const isActive = selectedSource === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedSource(chip.id);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: isActive ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: isActive ? 'var(--bg-paper)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-paper)',
                  minHeight: '34px',
                  whiteSpace: 'nowrap'
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Time of Day Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} color="var(--text-muted)" />
          <select
            value={selectedTimeOfDay}
            onChange={(e) => {
              setSelectedTimeOfDay(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.65rem',
              fontSize: '0.8125rem',
              border: '1px solid var(--border-paper)',
              borderRadius: '4px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)'
            }}
            aria-label="Filter by time of day"
          >
            <option value="all">All Times of Day</option>
            <option value="morning">Morning (06:00–12:00)</option>
            <option value="afternoon">Afternoon (12:00–17:00)</option>
            <option value="evening">Evening (17:00–23:00)</option>
            <option value="lateNight">Late Night (23:00–03:00)</option>
          </select>
        </div>
      </div>

      {/* Receipts Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {paginatedReceipts.length === 0 ? (
          <div className="paper-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              Nothing surfaced here yet.
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Try another date, source, or search keyword.
            </p>
          </div>
        ) : (
          paginatedReceipts.map((r) => (
            <div
              key={r.id}
              className="paper-card"
              style={{
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                <SourceBadge source={r.source} size="sm" />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {r.title}
                    </span>
                    {r.category && (
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>
                        {r.category}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    <span>{formatDate(r.timestamp)}</span>
                    {formatTime(r.timestamp) && <span>• {formatTime(r.timestamp)}</span>}
                    {r.subtitle && <span>• {r.subtitle}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {r.amount !== undefined && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--accent-orange)' }}>
                    {formatAmount(r.amount, r.currency)}
                  </div>
                )}

                {r.durationMs !== undefined && r.durationMs > 0 && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDuration(r.durationMs)}
                  </div>
                )}

                {onTraceReceipt && (
                  <button
                    onClick={() => onTraceReceipt(r)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-paper)',
                      borderRadius: '3px',
                      color: 'var(--text-primary)',
                      minHeight: '32px'
                    }}
                    title="Trace related activity around this receipt"
                  >
                    <Sparkles size={12} color="var(--accent-orange)" />
                    <span>Trace</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing page {currentPage} of {totalPages}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                minHeight: '34px'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', padding: '0 0.5rem' }}>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                minHeight: '34px'
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
