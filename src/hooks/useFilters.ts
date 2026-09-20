import { useState, useMemo } from 'react';
import { Receipt, ReceiptSource } from '../types/receipt';
import { getTimeOfDay } from '../lib/dates';

export function useFilters(receipts: Receipt[]) {
  const [source, setSource] = useState<string>('all');
  const [timeOfDay, setTimeOfDay] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      if (source === 'music' && r.source !== 'spotify') return false;
      if (source === 'purchases' && r.source !== 'transaction') return false;
      if (source === 'household' && r.source !== 'household') return false;

      if (timeOfDay !== 'all' && r.timestamp) {
        if (getTimeOfDay(r.timestamp) !== timeOfDay) return false;
      }

      if (selectedYear && r.timestamp) {
        const yr = new Date(r.timestamp).getFullYear().toString();
        if (yr !== selectedYear) return false;
      }

      return true;
    });
  }, [receipts, source, timeOfDay, selectedYear]);

  return {
    source,
    setSource,
    timeOfDay,
    setTimeOfDay,
    selectedYear,
    setSelectedYear,
    filtered
  };
}
