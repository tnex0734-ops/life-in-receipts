import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDuration, formatAmount, getTimeOfDay, sanitizeText } from '../src/data/normalize';

describe('Data Normalization Utilities', () => {
  it('formats dates safely without throwing on invalid or boundary values', () => {
    expect(formatDate(null)).toBe('Date unavailable');
    expect(formatDate(undefined)).toBe('Date unavailable');
    expect(formatDate('invalid-date')).toBe('Date unavailable');
    expect(formatDate('')).toBe('Date unavailable');
    expect(formatDate(0)).toBe('Date unavailable');
    expect(formatDate(NaN)).toBe('Date unavailable');

    // Valid timestamps
    const ts = new Date('2023-12-26T10:30:00Z').getTime();
    expect(formatDate(ts)).toContain('2023');
    expect(formatDate('2023-12-26')).toContain('2023');
  });

  it('formats time safely and handles missing/invalid values', () => {
    expect(formatTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
    expect(formatTime('invalid')).toBe('');
    expect(formatTime(0)).toBe('');

    const ts = new Date('2023-12-26T10:30:00Z').getTime();
    expect(formatTime(ts)).toBeTruthy();
  });

  it('formats amounts into currency correctly and guards against invalid inputs', () => {
    expect(formatAmount(0)).toBe('₹0');
    expect(formatAmount(8552.65, 'INR')).toBe('₹8,552.65');
    expect(formatAmount(100, 'USD')).toBe('$100');
    expect(formatAmount(null)).toBe('');
    expect(formatAmount(undefined)).toBe('');
    expect(formatAmount(NaN)).toBe('');
    expect(formatAmount(-50)).toBe('₹-50');
  });

  it('formats duration in milliseconds to human strings and handles edge cases', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(61865)).toBe('1m 1s');
    expect(formatDuration(285386)).toBe('4m 45s');
    expect(formatDuration(null)).toBe('0s');
    expect(formatDuration(undefined)).toBe('0s');
    expect(formatDuration(-100)).toBe('0s');
    expect(formatDuration(NaN)).toBe('0s');
  });

  it('correctly bins time of day into periods across all 24 hours', () => {
    const morning = new Date('2023-01-01T08:00:00').getTime();
    const afternoon = new Date('2023-01-01T14:00:00').getTime();
    const evening = new Date('2023-01-01T19:00:00').getTime();
    const lateNight1 = new Date('2023-01-01T23:30:00').getTime();
    const lateNight2 = new Date('2023-01-01T02:15:00').getTime();

    expect(getTimeOfDay(morning)).toBe('morning');
    expect(getTimeOfDay(afternoon)).toBe('afternoon');
    expect(getTimeOfDay(evening)).toBe('evening');
    expect(getTimeOfDay(lateNight1)).toBe('lateNight');
    expect(getTimeOfDay(lateNight2)).toBe('lateNight');
  });

  it('sanitizes strings and prevents empty, null, or whitespace-only fallbacks', () => {
    expect(sanitizeText(null, 'Default')).toBe('Default');
    expect(sanitizeText(undefined, 'Default')).toBe('Default');
    expect(sanitizeText('', 'Default')).toBe('Default');
    expect(sanitizeText('   ', 'Default')).toBe('Default');
    expect(sanitizeText('  The Beatles  ')).toBe('The Beatles');
    expect(sanitizeText(12345)).toBe('12345');
  });
});
