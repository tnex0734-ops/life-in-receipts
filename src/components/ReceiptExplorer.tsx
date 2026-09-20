import React, { useState, useMemo } from 'react';
import { Receipt, ReceiptSource } from '../types/receipt';
import { SourceBadge } from './SourceBadge';
import { formatDate, formatTime, formatDuration, formatAmount, getTimeOfDay } from '../data/normalize';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount' | 'duration'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Filter & Search
  const filteredReceipts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return receipts.filter((r) => {
      // Source filter
      if (selectedSource !== 'all' && r.source !== selectedSource) {
        return false;
      }

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
        const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSubtitle && !matchCategory && !matchAlbum && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [receipts, searchQuery, selectedSource, selectedTimeOfDay]);

  // Sort
  const sortedReceipts = useMemo(() => {
    const list = [...filteredReceipts];
    if (sortBy === 'newest') {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortBy === 'amount') {
      list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0));
    }
    return list;
  }, [filteredReceipts, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedReceipts.length / pageSize));
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedReceipts.slice(start, start + pageSize);
  }, [sortedReceipts, currentPage, pageSize]);

  return (
    <section className="receipt-explorer" aria-labelledby="receipts-heading" style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
          <Search size={14} />
          <span>Curated Archive Explorer • {sortedReceipts.length.toLocaleString()} Matching Records</span>
        </div>
        <h2 id="receipts-heading" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
          Life Receipts
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '620px', marginTop: '0.35rem' }}>
          Explore individual records across music streams, commercial card transactions, and household notes with instant search and filtering.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search artist, merchant, track, category..."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                fontSize: '0.875rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Source Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SOURCE:</span>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '0.55rem 0.75rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Sources</option>
              <option value="spotify">Spotify Music</option>
              <option value="transaction">Card Transactions</option>
              <option value="household">Household Entries</option>
            </select>
          </div>

          {/* Time of Day Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TIME:</span>
            <select
              value={selectedTimeOfDay}
              onChange={(e) => {
                setSelectedTimeOfDay(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '0.55rem 0.75rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">Any Time of Day</option>
              <option value="morning">Morning (06:00–12:00)</option>
              <option value="afternoon">Afternoon (12:00–17:00)</option>
              <option value="evening">Evening (17:00–23:00)</option>
              <option value="lateNight">Late Night (23:00–03:00)</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.55rem 0.75rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-paper)',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount">Largest Amount</option>
              <option value="duration">Longest Stream</option>
            </select>
          </div>
        </div>
      </div>

      {/* Receipts Table / Card Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {paginatedReceipts.length === 0 ? (
          <div className="paper-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No receipts match the current search or filters.
          </div>
        ) : (
          paginatedReceipts.map((r) => (
            <div
              key={r.id}
              className="paper-card"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              {/* Left Column: Source, Date, Title, Subtitle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                <SourceBadge source={r.source} size="sm" />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {r.title}
                    </span>
                    {r.category && (
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>
                        {r.category}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    <span>{formatDate(r.timestamp)}</span>
                    {formatTime(r.timestamp) && <span>• {formatTime(r.timestamp)}</span>}
                    {r.subtitle && <span>• {r.subtitle}</span>}
                  </div>
                </div>
              </div>

              {/* Right Column: Amount / Duration / Trace button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
                      padding: '0.35rem 0.75rem',
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

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing page {currentPage} of {totalPages} ({sortedReceipts.length.toLocaleString()} total)
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
                minHeight: '36px'
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
                minHeight: '36px'
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
