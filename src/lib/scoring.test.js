import { describe, it, expect } from 'vitest';
import { accuracy, starsForAccuracy, roundScore } from './scoring.js';

describe('accuracy', () => {
  it('is correct/total and guards divide-by-zero', () => {
    expect(accuracy(7, 10)).toBeCloseTo(0.7);
    expect(accuracy(0, 0)).toBe(0);
  });
});

describe('starsForAccuracy', () => {
  it('awards stars exactly at the 70/85/95% thresholds', () => {
    expect(starsForAccuracy(0.69)).toBe(0);
    expect(starsForAccuracy(0.7)).toBe(1);
    expect(starsForAccuracy(0.84)).toBe(1);
    expect(starsForAccuracy(0.85)).toBe(2);
    expect(starsForAccuracy(0.95)).toBe(3);
    expect(starsForAccuracy(1)).toBe(3);
  });
});

describe('roundScore', () => {
  it('is the run accumulated XP (0 when no run)', () => {
    expect(roundScore({ xpThisRun: 120 })).toBe(120);
    expect(roundScore(null)).toBe(0);
  });
});
