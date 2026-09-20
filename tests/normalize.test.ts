import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDuration, formatAmount, getTimeOfDay, sanitizeText } from '../src/data/normalize';

describe('Data Normalization Utilities', () => {
  it('formats dates safely without throwing on invalid values', () => {
    expect(formatDate(null)).toBe('Date unavailable');
    expect(formatDate(undefined)).toBe('Date unavailable');
    expect(formatDate('invalid-date')).toBe('Date unavailable');
    // Valid timestamp
    const ts = new Date('2023-12-26T10:30:00Z').getTime();
    expect(formatDate(ts)).toContain('2023');
  });

  it('formats amounts into currency correctly', () => {
    expect(formatAmount(0)).toBe('₹0');
    expect(formatAmount(8552.65, 'INR')).toBe('₹8,552.65');
    expect(formatAmount(null)).toBe('');
    expect(formatAmount(undefined)).toBe('');
  });

  it('formats duration in milliseconds to human strings', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(61865)).toBe('1m 1s');
    expect(formatDuration(285386)).toBe('4m 45s');
    expect(formatDuration(null)).toBe('0s');
  });

  it('correctly bins time of day into periods', () => {
    const morning = new Date('2023-01-01T08:00:00').getTime();
    const afternoon = new Date('2023-01-01T14:00:00').getTime();
    const evening = new Date('2023-01-01T19:00:00').getTime();
    const lateNight = new Date('2023-01-01T23:30:00').getTime();

    expect(getTimeOfDay(morning)).toBe('morning');
    expect(getTimeOfDay(afternoon)).toBe('afternoon');
    expect(getTimeOfDay(evening)).toBe('evening');
    expect(getTimeOfDay(lateNight)).toBe('lateNight');
  });

  it('sanitizes strings and prevents empty or null fallbacks', () => {
    expect(sanitizeText(null, 'Default')).toBe('Default');
    expect(sanitizeText('', 'Default')).toBe('Default');
    expect(sanitizeText('  The Beatles  ')).toBe('The Beatles');
  });
});
