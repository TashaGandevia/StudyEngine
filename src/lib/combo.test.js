import { describe, it, expect } from 'vitest';
import { comboMultiplier, isOnFire, COMBO_CAP } from './combo.js';

describe('comboMultiplier', () => {
  it('grows 0.2 per streak step and caps at ×2', () => {
    expect(comboMultiplier(0)).toBeCloseTo(1);
    expect(comboMultiplier(1)).toBeCloseTo(1.2);
    expect(comboMultiplier(5)).toBeCloseTo(2);
    expect(comboMultiplier(50)).toBeCloseTo(2); // capped
  });
});

describe('isOnFire', () => {
  it('is true once the multiplier maxes out', () => {
    expect(isOnFire(COMBO_CAP - 1)).toBe(false);
    expect(isOnFire(COMBO_CAP)).toBe(true);
  });
});
