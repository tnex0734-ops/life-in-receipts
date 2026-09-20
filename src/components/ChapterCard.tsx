import React from 'react';
import { StoryChapter } from '../types/story';

interface ChapterCardProps {
  chapter: StoryChapter;
  index: number;
  isActive: boolean;
  onSelect: (chapter: StoryChapter) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  index,
  isActive,
  onSelect
}) => {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`chapter-panel-${chapter.id}`}
      id={`chapter-tab-${chapter.id}`}
      onClick={() => onSelect(chapter)}
      className="paper-card"
      style={{
        textAlign: 'left',
        padding: '0.875rem 1rem',
        borderLeft: isActive ? '3px solid var(--accent-orange)' : '1px solid var(--border-paper)',
        background: isActive ? 'var(--bg-paper)' : 'var(--bg-card)',
        boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '0.2rem',
        minHeight: '64px'
      }}
    >
      <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
        Chapter 0{index + 1} • {chapter.startDate} to {chapter.endDate}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
        {chapter.title}
      </div>
    </button>
  );
};
