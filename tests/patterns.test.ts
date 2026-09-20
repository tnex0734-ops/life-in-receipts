import { describe, it, expect } from 'vitest';

describe('Pattern Calculations', () => {
  it('verifies late night threshold calculation (23:00 to 03:00)', () => {
    const hours = [23, 0, 1, 2, 3, 4, 8, 12, 18, 22];
    const isLateNight = (h: number) => h >= 23 || h < 3;

    const lateNightCount = hours.filter(isLateNight).length;
    expect(lateNightCount).toBe(4); // 23, 0, 1, 2
  });

  it('verifies percentage rounding precision', () => {
    const count = 27618;
    const total = 149860;
    const pct = ((count / total) * 100).toFixed(1);
    expect(pct).toBe('18.4');
  });
});
