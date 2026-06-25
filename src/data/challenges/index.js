// Challenge registry (SYS-9) — aggregates the per-zone banks.
//
// One import point for all content. The run builder reads from here; mini-games
// receive individual challenge objects. As CONTENT-Z* (M3) fills the zone files,
// they flow through here automatically.
import zone1 from './zone1.js';
import zone2 from './zone2.js';
import zone3 from './zone3.js';
import zone4 from './zone4.js';
import zone5 from './zone5.js';

// Challenges grouped by zone id.
export const CHALLENGES_BY_ZONE = {
  z1: zone1,
  z2: zone2,
  z3: zone3,
  z4: zone4,
  z5: zone5,
};

// Flat list of every challenge across all zones.
export const ALL_CHALLENGES = Object.values(CHALLENGES_BY_ZONE).flat();

// All challenges for one zone (or [] if unknown).
export function challengesForZone(zoneId) {
  return CHALLENGES_BY_ZONE[zoneId] ?? [];
}

// Look up a single challenge by id across all zones (or null).
export function getChallenge(id) {
  return ALL_CHALLENGES.find((c) => c.id === id) ?? null;
}
