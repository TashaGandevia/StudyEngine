// Scoring, accuracy & stars (SYS-6) — pure functions, no React.
//
// Round score (GDD §3.7): Σ(correct × baseXP × difficultyMult × comboMultAtTime).
// The reducer already accumulates exactly this into run.xpThisRun as each answer
// is scored (XP from SYS-3 × combo multiplier from SYS-4), so the "round score"
// IS run.xpThisRun — roundScore() just names/exposes it.

// Accuracy thresholds (as fractions) for 1★ / 2★ / 3★ per GDD §3.2.
export const STAR_THRESHOLDS = [0.7, 0.85, 0.95];

// Accuracy = correct / total, guarded against divide-by-zero. Range 0–1.
export function accuracy(correct, total) {
  return total > 0 ? correct / total : 0;
}

// Stars (0–3) earned for a given accuracy fraction.
export function starsForAccuracy(acc) {
  let stars = 0;
  for (const threshold of STAR_THRESHOLDS) {
    if (acc >= threshold) stars += 1;
  }
  return stars;
}

// The round score for a finished/active run (its accumulated XP).
export function roundScore(run) {
  return run ? run.xpThisRun : 0;
}
