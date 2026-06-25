import { describe, it, expect } from 'vitest';
import {
  createGameReducer,
  createInitialState,
  GAME_ACTION,
} from './gameReducer.js';
import {
  selectLevelProgress,
  selectUnlockedZones,
  selectStackCompletion,
  selectRunAccuracy,
  selectRunStars,
  selectBossFailed,
  selectReviewQueueSize,
  selectReviewIds,
} from './selectors.js';

const content = { zoneIds: ['z1', 'z2'], badges: [] };
const reducer = createGameReducer(content);
const fresh = () => createInitialState(content);

describe('selectors', () => {
  it('derives level progress from XP', () => {
    expect(
      selectLevelProgress({ ...fresh(), player: { xp: 100 } })
    ).toMatchObject({ level: 2, xpIntoLevel: 0 });
  });

  it('reports unlocked zones and stack completion', () => {
    const s = fresh();
    expect(selectUnlockedZones(s)).toEqual(['z1']);
    expect(selectStackCompletion(s)).toBe(0);
  });

  it('derives run accuracy, stars, and boss-failed state', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1', isBoss: true });
    s = reducer(s, { type: GAME_ACTION.ANSWER, correct: true });
    s = reducer(s, { type: GAME_ACTION.ANSWER, correct: false });
    expect(selectRunAccuracy(s)).toBeCloseTo(0.5);
    expect(selectRunStars(s)).toBe(0);
    expect(selectBossFailed(s)).toBe(false); // still has lives
  });

  it('reports review-queue size and ids', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: false,
      challengeId: 'q1',
    });
    expect(selectReviewQueueSize(s)).toBe(1);
    expect(selectReviewIds(s)).toEqual(['q1']);
  });
});
