import { describe, it, expect } from 'vitest';
import { evaluateBadges } from './badges.js';

const defs = [
  { id: 'perfect', test: (r) => r.total > 0 && r.correct === r.total },
  { id: 'boss', test: (r) => r.isBoss === true },
  {
    id: 'boom',
    test: () => {
      throw new Error('faulty predicate');
    },
  },
];

describe('evaluateBadges', () => {
  it('returns the ids whose predicate passes', () => {
    expect(
      evaluateBadges(defs, { correct: 3, total: 3, isBoss: false })
    ).toEqual(['perfect']);
    expect(
      evaluateBadges(defs, { correct: 2, total: 3, isBoss: true })
    ).toEqual(['boss']);
  });

  it('guards faulty predicates and bad input', () => {
    // 'boom' throws but is swallowed; 'perfect' still awarded.
    expect(evaluateBadges(defs, { correct: 1, total: 1 })).toEqual(['perfect']);
    expect(evaluateBadges(defs, null)).toEqual([]);
    expect(evaluateBadges(null, { correct: 1, total: 1 })).toEqual([]);
  });
});
