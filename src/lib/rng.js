// Random helpers (SYS-9) — pure, with an injectable RNG for determinism.
//
// Functions take an `rng` argument (a function returning [0,1), like
// Math.random). Pass a seeded RNG (mulberry32) when you need reproducible
// output — e.g. tests, or a "daily challenge" that's the same for everyone.

// Small, fast seeded PRNG. Returns a function producing floats in [0, 1).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Returns a new array with the input shuffled (Fisher–Yates). Does not mutate.
export function shuffle(array, rng = Math.random) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
