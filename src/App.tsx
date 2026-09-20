import React, { useState, useEffect } from 'react';
import { AppShell, AppView } from './components/AppShell';
import { StoryHero } from './components/StoryHero';
import { FeaturedInsight } from './components/FeaturedInsight';
import { TimeExplorer } from './components/TimeExplorer';
import { ChapterView } from './components/ChapterView';
import { MomentsView } from './components/MomentsView';
import { PatternsView } from './components/PatternsView';
import { Constellation } from './components/Constellation';
import { ReceiptExplorer } from './components/ReceiptExplorer';
import { TracePanel } from './components/TracePanel';
import { SearchCommand } from './components/SearchCommand';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { loadCoreArchiveData, loadSampleReceipts, ArchiveData } from './analytics/storyEngine';
import { Moment, StoryChapter, ConstellationNode } from './types/story';
import { Receipt } from './types/receipt';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<ArchiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation and filter states
  const [currentView, setCurrentView] = useState<AppView>('story');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Modals & Panels
  const [activeMoment, setActiveMoment] = useState<Moment | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Sync with URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    if (viewParam && ['story', 'moments', 'patterns', 'constellation', 'receipts'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
    const yearParam = params.get('year');
    if (yearParam) {
      setSelectedYear(yearParam);
    }
  }, []);

  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectYear = (year: string | null) => {
    setSelectedYear(year);
    const url = new URL(window.location.href);
    if (year) url.searchParams.set('year', year);
    else url.searchParams.delete('year');
    window.history.pushState({}, '', url.toString());
  };

  // Load Archive Data: Core summaries first for fast LCP, then preload sample receipts
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        setLoading(true);
        const coreData = await loadCoreArchiveData();
        if (!isMounted) return;

        setData({
          ...coreData,
          sampleReceipts: []
        });
        setLoading(false);

        // Preload sample receipts in the background without blocking initial paint
        loadSampleReceipts().then((receipts) => {
          if (isMounted) {
            setData((prev) => (prev ? { ...prev, sampleReceipts: receipts } : null));
          }
        });
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load archive data';
        setError(msg);
        setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', padding: '2rem' }}>
        <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div className="receipt-stamp stamp-orange" style={{ marginBottom: '1.25rem' }}>
            Reconstructing The Archive
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Life in Receipts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <div>Reading 149,860 music receipts...</div>
            <div>Scrubbing sensitive financial fields...</div>
            <div>Connecting temporal convergences...</div>
            <div>Synthesizing living chapters...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', padding: '2rem' }}>
        <div className="paper-card" style={{ maxWidth: '480px', padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={36} color="var(--accent-orange)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>The archive couldn't be loaded.</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'Check that local data files exist in public/data/ and try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--accent-orange)',
              color: '#FFFFFF',
              fontWeight: 600,
              padding: '0.6rem 1.25rem',
              borderRadius: '4px'
            }}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const totalReceiptsCount =
    (data.spotifySummary?.totalCount || 149860) +
    (data.transactionSummary?.totalCount || 10267) +
    (data.householdSummary?.totalCount || 2461);

  // Trace the primary featured pattern (late night)
  const handleTraceFeaturedPattern = () => {
    // Find a rich moment that includes late night activity
    const lateNightMoment = data.moments.find((m) =>
      m.receipts.some((r) => r.category === 'entertainment' || r.category === 'Food')
    ) || data.moments[0];
    if (lateNightMoment) {
      setActiveMoment(lateNightMoment);
    } else {
      handleSelectView('patterns');
    }
  };

  return (
    <div className="app-layout">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AppShell
        currentView={currentView}
        onSelectView={handleSelectView}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        totalReceiptsCount={totalReceiptsCount}
      />

      <main className="app-container" id="main-content">
        {/* STORY / HOME VIEW */}
        {currentView === 'story' && (
          <>
            {/* 1. STORY-FIRST HERO */}
            <StoryHero
              onExplore={() => {
                const el = document.getElementById('featured-insight-title');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSeePatterns={() => handleSelectView('patterns')}
              stats={{
                totalReceipts: totalReceiptsCount,
                yearsSpan: '2013 — 2024',
                momentsCount: data.moments.length,
                chaptersCount: data.chapters.length
              }}
            />

            {/* 2. FEATURED INSIGHT (THE FIRST WOW MOMENT) */}
            <FeaturedInsight
              rhythmsPattern={data.patterns.listeningRhythms}
              onTrace={handleTraceFeaturedPattern}
            />

            {/* 3. MOMENTS (HUMAN-SIZED STORIES) */}
            <MomentsView
              moments={data.moments}
              onTraceMoment={(m) => setActiveMoment(m)}
              initialLimit={6}
            />

            {/* 4. ACTIVITY RIVER (TIME EXPLORER) */}
            <TimeExplorer
              selectedYear={selectedYear}
              onSelectYear={handleSelectYear}
            />

            {/* 5. LIVING CHAPTERS */}
            <ChapterView
              chapters={data.chapters}
              selectedYear={selectedYear}
              onSelectChapter={(ch) => {
                // Focus chapter
              }}
              onViewEvidence={(ch) => {
                handleSelectView('receipts');
              }}
            />

            {/* 6. CONSTELLATION OVERVIEW */}
            <Constellation
              nodes={data.constellation.nodes}
              edges={data.constellation.edges}
              onTraceThread={(node) => {
                handleSelectView('constellation');
              }}
            />
          </>
        )}

        {/* MOMENTS VIEW */}
        {currentView === 'moments' && (
          <MomentsView
            moments={data.moments}
            onTraceMoment={(m) => setActiveMoment(m)}
            initialLimit={45}
          />
        )}

        {/* PATTERNS VIEW */}
        {currentView === 'patterns' && (
          <PatternsView
            patterns={data.patterns}
            onTracePattern={(pId) => {
              handleSelectView('receipts');
            }}
          />
        )}

        {/* CONSTELLATION VIEW */}
        {currentView === 'constellation' && (
          <Constellation
            nodes={data.constellation.nodes}
            edges={data.constellation.edges}
            onTraceThread={(node) => {
              const relatedMoment = data.moments.find((m) =>
                m.title.toLowerCase().includes(node.label.toLowerCase()) ||
                m.receipts.some((r) => r.title.toLowerCase().includes(node.label.toLowerCase()))
              );
              if (relatedMoment) setActiveMoment(relatedMoment);
              else handleSelectView('receipts');
            }}
          />
        )}

        {/* RECEIPTS VIEW */}
        {currentView === 'receipts' && (
          <ReceiptExplorer
            receipts={data.sampleReceipts}
            onTraceReceipt={(r) => setActiveReceipt(r)}
          />
        )}
      </main>

      {/* Signature TRACE Drawer / Mobile Bottom Sheet */}
      {(activeMoment || activeReceipt) && (
        <TracePanel
          moment={activeMoment}
          receipt={activeReceipt}
          onClose={() => {
            setActiveMoment(null);
            setActiveReceipt(null);
          }}
          onViewReceipts={() => {
            handleSelectView('receipts');
          }}
        />
      )}

      {/* Global Search Command Dialog (Ctrl+K) */}
      <SearchCommand
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        receipts={data.sampleReceipts}
        moments={data.moments}
        chapters={data.chapters}
        onSelectChapter={(ch) => {
          handleSelectView('story');
        }}
        onSelectMoment={(m) => {
          setActiveMoment(m);
        }}
        onSelectReceipt={(r) => {
          setActiveReceipt(r);
        }}
      />

      {/* Dataset Diagnostics & Privacy Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        data={data}
      />
    </div>
  );
};
export default App;
