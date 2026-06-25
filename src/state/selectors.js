// Selectors (SYS-1) — pure functions that derive values from game state.
//
// Keeping derivation here (rather than storing computed values) means there's
// one source of truth (e.g. player.xp) and no risk of stored copies drifting.
import { levelFromXp } from '../lib/leveling.js';
import {
  accuracy as computeAccuracy,
  starsForAccuracy,
  roundScore,
} from '../lib/scoring.js';

// Derives current level + progress toward the next level from lifetime XP.
// The curve math lives in lib/leveling.js (SYS-3); this is the state-aware
// wrapper. Returns { level, xpIntoLevel, xpForNext, progress }.
export function selectLevelProgress(state) {
  return levelFromXp(state.player.xp);
}

// Ids of all currently unlocked zones, in declared order.
export function selectUnlockedZones(state) {
  return Object.entries(state.zones)
    .filter(([, zone]) => zone.unlocked)
    .map(([id]) => id);
}

// Stack-completion fraction (completed zones / total) — the headline overworld
// metric in the GDD.
export function selectStackCompletion(state) {
  const all = Object.values(state.zones);
  if (all.length === 0) return 0;
  const done = all.filter((z) => z.completed).length;
  return done / all.length;
}

// Accuracy of the active run (0–1); 0 when no run or no answers yet.
export function selectRunAccuracy(state) {
  const run = state.run;
  return run ? computeAccuracy(run.correct, run.total) : 0;
}

// Stars (0–3) the active run would earn at its current accuracy.
export function selectRunStars(state) {
  return starsForAccuracy(selectRunAccuracy(state));
}

// Score (accumulated XP) of the active run.
export function selectRunScore(state) {
  return roundScore(state.run);
}

// True when an active boss run has run out of lives (SYS-5). Non-boss runs have
// lives === null and so never fail this way.
export function selectBossFailed(state) {
  const run = state.run;
  return Boolean(run && run.isBoss && run.lives === 0);
}
