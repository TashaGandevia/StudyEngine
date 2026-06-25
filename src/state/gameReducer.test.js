import { describe, it, expect } from 'vitest';
import {
  createGameReducer,
  createInitialState,
  GAME_ACTION,
} from './gameReducer.js';
import { EVENT } from './flowMachine.js';

// A small, arbitrary content pack — proves the engine is content-agnostic.
const content = {
  zoneIds: ['z1', 'z2', 'z3'],
  badges: [
    { id: 'flawless', test: (r) => r.total > 0 && r.correct === r.total },
    { id: 'comeback', test: (r) => r.isBoss && r.lives === 1 },
  ],
};
const reducer = createGameReducer(content);
const fresh = () => createInitialState(content);

describe('createInitialState', () => {
  it('seeds zones from the content pack with only the first unlocked', () => {
    const s = fresh();
    expect(Object.keys(s.zones)).toEqual(['z1', 'z2', 'z3']);
    expect(s.zones.z1.unlocked).toBe(true);
    expect(s.zones.z2.unlocked).toBe(false);
  });
});

describe('run lifecycle', () => {
  it('tracks answers, resets combo on a miss, and queues the miss', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: true,
      difficulty: 'med',
    });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: false,
      challengeId: 'z1_x',
    });
    expect(s.run).toMatchObject({ correct: 1, total: 2, combo: 0 });
    expect(s.reviewQueue).toEqual([{ id: 'z1_x', remaining: 2 }]);
  });

  it('completeRun banks XP, marks complete, unlocks next, awards badges', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: true,
      difficulty: 'easy',
    });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: true,
      difficulty: 'easy',
    });
    s = reducer(s, { type: GAME_ACTION.COMPLETE_RUN });
    expect(s.run).toBe(null);
    expect(s.zones.z1).toMatchObject({ completed: true, stars: 3 });
    expect(s.zones.z2.unlocked).toBe(true);
    expect(s.badges).toContain('flawless');
    expect(s.player.xp).toBeGreaterThan(0);
  });

  it('keeps the best result on a worse replay', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, { type: GAME_ACTION.ANSWER, correct: true });
    s = reducer(s, { type: GAME_ACTION.COMPLETE_RUN });
    const best = s.zones.z1.stars;

    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, {
      type: GAME_ACTION.ANSWER,
      correct: false,
      challengeId: 'q',
    });
    s = reducer(s, { type: GAME_ACTION.COMPLETE_RUN });
    expect(s.zones.z1.stars).toBe(best);
  });
});

describe('lives', () => {
  it('non-boss runs never lose lives', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    expect(s.run.lives).toBe(null);
    s = reducer(s, { type: GAME_ACTION.ANSWER, correct: false });
    expect(s.run.lives).toBe(null);
  });

  it('boss runs lose a life per wrong answer and floor at 0', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1', isBoss: true });
    expect(s.run.lives).toBe(3);
    for (let i = 0; i < 4; i++) {
      s = reducer(s, { type: GAME_ACTION.ANSWER, correct: false });
    }
    expect(s.run.lives).toBe(0);
  });
});

describe('RESET and flow delegation', () => {
  it('RESET returns a fresh game for this content pack', () => {
    let s = fresh();
    s = reducer(s, { type: GAME_ACTION.START_RUN, zoneId: 'z1' });
    s = reducer(s, { type: GAME_ACTION.ANSWER, correct: true });
    s = reducer(s, { type: GAME_ACTION.COMPLETE_RUN });
    const r = reducer(s, { type: GAME_ACTION.RESET });
    expect(r.player.xp).toBe(0);
    expect(r.zones.z2.unlocked).toBe(false);
    expect(Object.keys(r.zones)).toEqual(['z1', 'z2', 'z3']);
  });

  it('delegates flow events to the flow machine', () => {
    const s = reducer(fresh(), { type: EVENT.START_NEW });
    expect(s.flow).toBe('ONBOARDING');
  });
});
