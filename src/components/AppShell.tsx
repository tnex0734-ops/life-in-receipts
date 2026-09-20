import React from 'react';
import { BookOpen, Sparkles, TrendingUp, Network, Layers, Search, Database } from 'lucide-react';
import { Logo } from './Logo';

export type AppView = 'story' | 'moments' | 'patterns' | 'constellation' | 'receipts';

interface AppShellProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenSearch: () => void;
  onOpenDiagnostics: () => void;
  totalReceiptsCount: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onSelectView,
  onOpenSearch,
  onOpenDiagnostics,
  totalReceiptsCount
}) => {
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          {/* Brand */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectView('story');
            }}
            className="brand-block"
            aria-label="Life In Receipts — Home"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'var(--text-primary)', borderRadius: '4px' }}>
              <Logo size={24} color="var(--bg-paper)" />
            </div>
            <div>
              <div className="brand-title">Life in Receipts</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <span className="brand-tag">Archive 2013–24</span>
                <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {totalReceiptsCount.toLocaleString()} traces
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Tabs */}
          <nav className="nav-tabs" aria-label="Main Navigation">
            <button
              onClick={() => onSelectView('story')}
              className={`nav-tab-btn ${currentView === 'story' ? 'active' : ''}`}
              aria-current={currentView === 'story' ? 'page' : undefined}
            >
              <BookOpen size={14} />
              <span>Story</span>
            </button>

            <button
              onClick={() => onSelectView('moments')}
              className={`nav-tab-btn ${currentView === 'moments' ? 'active' : ''}`}
              aria-current={currentView === 'moments' ? 'page' : undefined}
            >
              <Sparkles size={14} />
              <span>Moments</span>
            </button>

            <button
              onClick={() => onSelectView('patterns')}
              className={`nav-tab-btn ${currentView === 'patterns' ? 'active' : ''}`}
              aria-current={currentView === 'patterns' ? 'page' : undefined}
            >
              <TrendingUp size={14} />
              <span>Patterns</span>
            </button>

            <button
              onClick={() => onSelectView('constellation')}
              className={`nav-tab-btn ${currentView === 'constellation' ? 'active' : ''}`}
              aria-current={currentView === 'constellation' ? 'page' : undefined}
            >
              <Network size={14} />
              <span>Constellation</span>
            </button>

            <button
              onClick={() => onSelectView('receipts')}
              className={`nav-tab-btn ${currentView === 'receipts' ? 'active' : ''}`}
              aria-current={currentView === 'receipts' ? 'page' : undefined}
            >
              <Layers size={14} />
              <span>Receipts</span>
            </button>
          </nav>

          {/* Actions: Search & Diagnostics */}
          <div className="header-actions">
            <button
              onClick={onOpenSearch}
              className="search-trigger-btn"
              aria-label="Search archive (Ctrl+K)"
            >
              <Search size={14} />
              <span>Search</span>
              <kbd className="kbd-badge">Ctrl K</kbd>
            </button>

            <button
              onClick={onOpenDiagnostics}
              style={{
                minHeight: '38px',
                minWidth: '38px',
                border: '1px solid var(--border-paper)',
                background: 'var(--bg-card)',
                borderRadius: '6px',
                color: 'var(--text-muted)'
              }}
              title="View Dataset Integrity & Diagnostics"
              aria-label="Dataset Diagnostics"
            >
              <Database size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        <button
          onClick={() => onSelectView('story')}
          className={`mobile-nav-btn ${currentView === 'story' ? 'active' : ''}`}
        >
          <BookOpen size={18} />
          <span>Story</span>
        </button>

        <button
          onClick={() => onSelectView('moments')}
          className={`mobile-nav-btn ${currentView === 'moments' ? 'active' : ''}`}
        >
          <Sparkles size={18} />
          <span>Moments</span>
        </button>

        <button
          onClick={() => onSelectView('patterns')}
          className={`mobile-nav-btn ${currentView === 'patterns' ? 'active' : ''}`}
        >
          <TrendingUp size={18} />
          <span>Patterns</span>
        </button>

        <button
          onClick={() => onSelectView('constellation')}
          className={`mobile-nav-btn ${currentView === 'constellation' ? 'active' : ''}`}
        >
          <Network size={18} />
          <span>Constellation</span>
        </button>

        <button
          onClick={() => onSelectView('receipts')}
          className={`mobile-nav-btn ${currentView === 'receipts' ? 'active' : ''}`}
        >
          <Layers size={18} />
          <span>Receipts</span>
        </button>
      </nav>
    </>
  );
};
