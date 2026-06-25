import { describe, it, expect } from 'vitest';
import { buildRun } from './buildRun.js';
import { mulberry32 } from './rng.js';

const pool = [
  { id: 'a', difficulty: 'easy' },
  { id: 'b', difficulty: 'easy' },
  { id: 'c', difficulty: 'med' },
  { id: 'd', difficulty: 'med' },
  { id: 'e', difficulty: 'hard' },
  { id: 'f', difficulty: 'hard' },
];

describe('buildRun', () => {
  it('honors the requested count', () => {
    expect(
      buildRun({ zoneChallenges: pool, count: 3, rng: mulberry32(1) })
    ).toHaveLength(3);
  });

  it('follows a difficulty curve', () => {
    const run = buildRun({
      zoneChallenges: pool,
      count: 5,
      difficultyCurve: ['easy', 'easy', 'med', 'med', 'hard'],
      rng: mulberry32(42),
    });
    expect(run.map((c) => c.difficulty)).toEqual([
      'easy',
      'easy',
      'med',
      'med',
      'hard',
    ]);
  });

  it('weights in review candidates and never duplicates', () => {
    const run = buildRun({
      zoneChallenges: pool,
      reviewCandidates: [{ id: 'r', difficulty: 'med' }],
      count: 4,
      reviewBias: 0.5,
      rng: mulberry32(3),
    });
    expect(run.some((c) => c.id === 'r')).toBe(true);
    expect(new Set(run.map((c) => c.id)).size).toBe(run.length);
  });

  it('returns an empty queue when there is no content', () => {
    expect(buildRun({})).toEqual([]);
  });
});
