// Combo / streak math (SYS-4) — pure functions, no React.
//
// Per GDD §3.4: each consecutive correct answer raises the combo; a wrong
// answer resets it to 0 (that reset lives in the reducer). The XP multiplier
// grows with the streak and caps at ×2:
//   multiplier = 1 + min(combo, 5) * 0.2
// So combo 0 → ×1.0, combo 1 → ×1.2, ... combo 5+ → ×2.0 ("on fire").

export const COMBO_CAP = 5;

// XP multiplier for a given combo count (capped at the cap).
export function comboMultiplier(combo) {
  return 1 + Math.min(combo, COMBO_CAP) * 0.2;
}

// True once the multiplier has maxed out (the "on fire" flourish threshold).
export function isOnFire(combo) {
  return combo >= COMBO_CAP;
}
