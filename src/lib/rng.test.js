import { describe, it, expect } from 'vitest';
import { mulberry32, shuffle } from './rng.js';

describe('mulberry32', () => {
  it('is deterministic for a given seed and stays in [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = [a(), a(), a()];
    expect(seqA).toEqual([b(), b(), b()]);
    for (const n of seqA) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, mulberry32(1));
    expect(out).toHaveLength(5);
    expect([...out].sort((x, y) => x - y)).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]); // unmutated
  });

  it('is deterministic with a seeded RNG', () => {
    expect(shuffle([1, 2, 3, 4, 5], mulberry32(7))).toEqual(
      shuffle([1, 2, 3, 4, 5], mulberry32(7))
    );
  });
});
