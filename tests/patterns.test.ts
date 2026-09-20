import { describe, it, expect } from 'vitest';

export function calculateHourBins(hours: number[]) {
  const bins = { morning: 0, afternoon: 0, evening: 0, lateNight: 0, dawn: 0 };
  for (const h of hours) {
    if (h >= 6 && h < 12) bins.morning++;
    else if (h >= 12 && h < 17) bins.afternoon++;
    else if (h >= 17 && h < 23) bins.evening++;
    else if (h >= 23 || h < 3) bins.lateNight++;
    else bins.dawn++;
  }
  return bins;
}

export function calculatePercentage(count: number, total: number): string {
  if (!total || total <= 0) return '0.0';
  return ((count / total) * 100).toFixed(1);
}

describe('Pattern Calculations & Hour Binning', () => {
  it('verifies late night threshold calculation (23:00 to 03:00)', () => {
    const hours = [23, 0, 1, 2, 3, 4, 8, 12, 18, 22];
    const isLateNight = (h: number) => h >= 23 || h < 3;

    const lateNightCount = hours.filter(isLateNight).length;
    expect(lateNightCount).toBe(4); // 23, 0, 1, 2
  });

  it('correctly categorizes all 24 hours into designated bins', () => {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    const bins = calculateHourBins(allHours);

    expect(bins.morning).toBe(6); // 6,7,8,9,10,11
    expect(bins.afternoon).toBe(5); // 12,13,14,15,16
    expect(bins.evening).toBe(6); // 17,18,19,20,21,22
    expect(bins.lateNight).toBe(4); // 23,0,1,2
    expect(bins.dawn).toBe(3); // 3,4,5
    expect(bins.morning + bins.afternoon + bins.evening + bins.lateNight + bins.dawn).toBe(24);
  });

  it('verifies percentage rounding precision', () => {
    const count = 27618;
    const total = 149860;
    const pct = calculatePercentage(count, total);
    expect(pct).toBe('18.4');
  });

  it('safely handles zero total without producing NaN or Infinity', () => {
    expect(calculatePercentage(10, 0)).toBe('0.0');
    expect(calculatePercentage(0, 0)).toBe('0.0');
    expect(calculatePercentage(0, -10)).toBe('0.0');
  });
});
