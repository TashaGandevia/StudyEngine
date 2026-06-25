import { describe, it, expect } from 'vitest';
import {
  applyAnswerToQueue,
  reviewIds,
  REQUIRED_CORRECT,
} from './reviewQueue.js';

describe('applyAnswerToQueue', () => {
  it('queues a missed item with the full requirement', () => {
    expect(applyAnswerToQueue([], { id: 'a', correct: false })).toEqual([
      { id: 'a', remaining: REQUIRED_CORRECT },
    ]);
  });

  it('clears an item after two correct answers', () => {
    let q = applyAnswerToQueue([], { id: 'a', correct: false });
    q = applyAnswerToQueue(q, { id: 'a', correct: true });
    expect(q[0].remaining).toBe(1);
    q = applyAnswerToQueue(q, { id: 'a', correct: true });
    expect(q).toEqual([]);
  });

  it('resets the counter when a partially-cleared item is missed again', () => {
    let q = applyAnswerToQueue([], { id: 'a', correct: false });
    q = applyAnswerToQueue(q, { id: 'a', correct: true }); // remaining 1
    q = applyAnswerToQueue(q, { id: 'a', correct: false }); // reset
    expect(q[0].remaining).toBe(REQUIRED_CORRECT);
  });

  it('ignores correct answers for non-queued ids and a missing id', () => {
    expect(applyAnswerToQueue([], { id: 'x', correct: true })).toEqual([]);
    const q = [{ id: 'a', remaining: 2 }];
    expect(applyAnswerToQueue(q, { correct: false })).toBe(q);
  });

  it('reviewIds extracts the ids', () => {
    expect(
      reviewIds([
        { id: 'a', remaining: 2 },
        { id: 'b', remaining: 1 },
      ])
    ).toEqual(['a', 'b']);
  });
});
