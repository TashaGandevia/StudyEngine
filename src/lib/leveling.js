// XP & leveling math (SYS-3) — pure functions, no React.
//
// Per GDD §3.2:
//   - XP per correct answer = base 20 × difficulty multiplier (the combo
//     multiplier is layered on in SYS-4).
//   - Level curve: the XP needed to advance FROM level n is 100 * n^1.5.
// player.xp (lifetime XP) is the stored source of truth; level and
// xp-into-level are derived from it here so they can never drift.

export const BASE_XP = 20;

// Difficulty multipliers keyed by the challenge `difficulty` field.
export const DIFFICULTY_MULT = {
  easy: 1,
  med: 1.5,
  hard: 2,
};

// XP awarded for a single answer. Wrong answers earn nothing. Unknown/absent
// difficulty falls back to ×1 so content without a difficulty still scores.
export function xpForAnswer({ correct, difficulty } = {}) {
  if (!correct) return 0;
  const mult = DIFFICULTY_MULT[difficulty] ?? 1;
  return Math.round(BASE_XP * mult);
}

// XP required to advance FROM level n to n+1.
export function xpForLevel(n) {
  return Math.floor(100 * Math.pow(n, 1.5));
}

// Derives the current level and progress from lifetime XP.
// Returns { level, xpIntoLevel, xpForNext, progress } where progress is 0–1.
export function levelFromXp(totalXp) {
  let level = 1;
  let cumulative = 0;
  // Climb levels while the player can still afford the next one.
  while (cumulative + xpForLevel(level) <= totalXp) {
    cumulative += xpForLevel(level);
    level += 1;
  }
  const xpIntoLevel = totalXp - cumulative;
  const xpForNext = xpForLevel(level);
  return {
    level,
    xpIntoLevel,
    xpForNext,
    progress: xpForNext > 0 ? xpIntoLevel / xpForNext : 0,
  };
}
