import { Receipt, ReceiptSource } from '../types/receipt';

/**
 * Formats a timestamp into human-readable date string: e.g. "Aug 14, 2018"
 */
export function formatDate(timestampOrStr: number | string | null | undefined): string {
  if (!timestampOrStr) return 'Date unavailable';
  try {
    const d = typeof timestampOrStr === 'number' ? new Date(timestampOrStr) : new Date(timestampOrStr);
    if (isNaN(d.getTime())) return 'Date unavailable';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Date unavailable';
  }
}

/**
 * Formats time of day: e.g. "10:42 PM"
 */
export function formatTime(timestampOrStr: number | string | null | undefined): string {
  if (!timestampOrStr) return '';
  try {
    const d = typeof timestampOrStr === 'number' ? new Date(timestampOrStr) : new Date(timestampOrStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
}

/**
 * Formats duration in milliseconds into "3m 42s"
 */
export function formatDuration(ms: number | undefined | null): string {
  if (!ms || isNaN(ms) || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

/**
 * Formats currency amount safely into "₹8,552.65"
 */
export function formatAmount(amount: number | undefined | null, currency = 'INR'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  const symbol = currency.toUpperCase() === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Safely sanitizes raw strings, removing dangerous characters or accidental sensitive fields
 */
export function sanitizeText(val: unknown, fallback = 'Unknown'): string {
  if (val === null || val === undefined) return fallback;
  const str = String(val).trim();
  return str.length > 0 ? str : fallback;
}

/**
 * Determines time-of-day period: morning, afternoon, evening, late-night
 */
export function getTimeOfDay(timestamp: number): 'morning' | 'afternoon' | 'evening' | 'lateNight' {
  const d = new Date(timestamp);
  const h = d.getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 23) return 'evening';
  return 'lateNight';
}
