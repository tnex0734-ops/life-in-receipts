import React from 'react';
import { PatternSignal } from '../types/story';
import { Moon, Calendar, Music, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

interface PatternsViewProps {
  patterns: Record<string, PatternSignal>;
  onTracePattern?: (patternId: string) => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({ patterns }) => {
  const rhythms = patterns.listeningRhythms;
  const repeatDays = patterns.repeatDays;
  const topSounds = patterns.topSounds;
  const spending = patterns.spendingSignals;
  const crossSource = patterns.crossSourceOverlap;

  return (
    <section className="patterns-view" aria-labelledby="patterns-heading" style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
          <TrendingUp size={14} />
          <span>Pattern Engine • Deterministic Signals</span>
        </div>
        <h2 id="patterns-heading" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
          Discovered Life Rhythms
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '620px', marginTop: '0.35rem' }}>
          Calculated across 149k audio streams, 10k card transactions, and 2.4k household entries. Every pattern is anchored by empirical evidence.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* 1. LISTENING RHYTHMS */}
        {rhythms && (
          <div className="paper-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)' }}>
                <Moon size={18} />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{rhythms.title}</span>
              </div>
              <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
                {rhythms.peakPeriod || 'Late Night'}
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {rhythms.description}
            </p>

            {/* Distribution Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {rhythms.distribution?.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.pct}% ({item.count?.toLocaleString()} plays)</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.pct}%`,
                        height: '100%',
                        background: item.label?.includes('Late Night') ? 'var(--accent-orange)' : 'var(--accent-teal)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Evidence Footer */}
            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="var(--accent-teal)" />
              <span>Evidence: {rhythms.evidence?.confidence || 'Calculated from full archive'}</span>
            </div>
          </div>
        )}

        {/* 2. REPEAT DAYS */}
        {repeatDays && (
          <div className="paper-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)' }}>
                <Calendar size={18} />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{repeatDays.title}</span>
              </div>
              <span className="receipt-stamp stamp-teal" style={{ fontSize: '0.6875rem' }}>
                Peak: {repeatDays.evidence?.peakDay}
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {repeatDays.description}
            </p>

            {/* Weekly Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '0.4rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-paper)' }}>
              {repeatDays.distribution?.map((d, idx) => (
                <div key={idx} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(10, parseFloat(d.pct) * 5)}%`,
                      background: d.day === repeatDays.evidence?.peakDay ? 'var(--accent-orange)' : 'var(--accent-navy)',
                      borderRadius: '2px 2px 0 0'
                    }}
                    title={`${d.day}: ${d.pct}% (${d.count?.toLocaleString()} events)`}
                  />
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {d.day?.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="var(--accent-teal)" />
              <span>Evidence: {repeatDays.evidence?.confidence || 'Analyzed across 11 years'}</span>
            </div>
          </div>
        )}

        {/* 3. TOP SOUNDS */}
        {topSounds && (
          <div className="paper-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-navy)' }}>
                <Music size={18} />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{topSounds.title}</span>
              </div>
              <span className="receipt-stamp stamp-navy" style={{ fontSize: '0.6875rem' }}>
                {topSounds.evidence?.uniqueArtists?.toLocaleString()} Artists
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {topSounds.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {topSounds.artists?.slice(0, 5).map((art, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-paper)', padding: '0.4rem 0.6rem', borderRadius: '3px', border: '1px solid var(--border-paper)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    0{idx + 1}. {art.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {art.count.toLocaleString()} plays
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="var(--accent-teal)" />
              <span>Evidence: Lead artist with {topSounds.evidence?.leadArtistCount?.toLocaleString()} verified streams</span>
            </div>
          </div>
        )}

        {/* 4. SPENDING SIGNALS */}
        {spending && (
          <div className="paper-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)' }}>
                <TrendingUp size={18} />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{spending.title}</span>
              </div>
              <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
                {spending.evidence?.totalCategories} Categories
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {spending.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {spending.transactionCategories?.slice(0, 6).map((c, i) => (
                <div key={i} style={{ background: 'var(--bg-subtle)', padding: '0.35rem 0.65rem', borderRadius: '3px', border: '1px solid var(--border-paper)', fontSize: '0.75rem' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name.replace(/_/g, ' ')}: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="var(--accent-teal)" />
              <span>Evidence: Strongest concentration in {spending.evidence?.leadCategory}</span>
            </div>
          </div>
        )}

        {/* 5. CROSS-SOURCE OVERLAPS */}
        {crossSource && (
          <div className="paper-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)' }}>
                <Layers size={18} />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{crossSource.title}</span>
              </div>
              <span className="receipt-stamp stamp-teal" style={{ fontSize: '0.6875rem' }}>
                {crossSource.momentsCount} Overlaps
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {crossSource.description}
            </p>

            <div style={{ background: 'var(--bg-paper)', padding: '1rem', borderRadius: '3px', border: '1px solid var(--border-paper)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Verified Active Spans</div>
              <div style={{ color: 'var(--text-secondary)' }}>{crossSource.evidence?.activeSpans}</div>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-dashed)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="var(--accent-teal)" />
              <span>Evidence: Multi-source timestamps cross-validated within 24h</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
