import { describe, it, expect } from 'vitest';
import { xpForAnswer, xpForLevel, levelFromXp } from './leveling.js';

describe('xpForAnswer', () => {
  it('scales base XP by difficulty', () => {
    expect(xpForAnswer({ correct: true, difficulty: 'easy' })).toBe(20);
    expect(xpForAnswer({ correct: true, difficulty: 'med' })).toBe(30);
    expect(xpForAnswer({ correct: true, difficulty: 'hard' })).toBe(40);
  });

  it('defaults unknown/missing difficulty to ×1', () => {
    expect(xpForAnswer({ correct: true })).toBe(20);
    expect(xpForAnswer({ correct: true, difficulty: 'bogus' })).toBe(20);
  });

  it('awards nothing for wrong answers', () => {
    expect(xpForAnswer({ correct: false, difficulty: 'hard' })).toBe(0);
  });
});

describe('level curve', () => {
  it('xpForLevel follows 100 * n^1.5', () => {
    expect(xpForLevel(1)).toBe(100);
    expect(xpForLevel(2)).toBe(282);
    expect(xpForLevel(4)).toBe(800);
  });

  it('derives level + progress from total XP', () => {
    expect(levelFromXp(0)).toMatchObject({ level: 1, xpIntoLevel: 0 });
    expect(levelFromXp(100)).toMatchObject({ level: 2, xpIntoLevel: 0 });
    expect(levelFromXp(381)).toMatchObject({ level: 2, xpIntoLevel: 281 });
    expect(levelFromXp(382)).toMatchObject({ level: 3, xpIntoLevel: 0 });
  });
});
