import { useEffect } from 'react';

interface ShortcutHandlers {
  onOpenSearch?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onOpenSearch, onEscape }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
      if (e.key === 'Escape') {
        onEscape?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch, onEscape]);
}
