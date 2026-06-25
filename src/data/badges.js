// Badge definitions (SYS-7) — data, not code, so new badges are easy to add.
//
// Each badge is { id, name, desc, zone?, test(run) }. The test predicate
// receives the finished run (see gameReducer COMPLETE_RUN) and returns true if
// the badge is earned. evaluateBadges() runs them all on completion.
//
// Some predicates reference mini-game-specific fields that don't exist yet
// (e.g. run.wastedMoves, run.stalls) — those mini-games land in M3. Until then
// `undefined === 0` is false, so the badge simply stays locked. This keeps the
// data-driven set complete and forward-compatible without premature unlocks.

// Helper: a run's accuracy (avoids importing the scoring lib into data).
const isPerfect = (run) => run.total > 0 && run.correct === run.total;

export const BADGES = [
  {
    id: 'status_sleuth',
    name: 'Status Sleuth',
    desc: 'Finish Zone 1 with a perfect run.',
    zone: 'z1',
    test: (run) => run.zoneId === 'z1' && isPerfect(run),
  },
  {
    id: 'loop_keeper',
    name: 'Loop Keeper',
    desc: 'Clear Zone 3 without stalling the event loop.',
    zone: 'z3',
    // run.stalls is set by the Event Loop mini-game (M3); locked until then.
    test: (run) => run.zoneId === 'z3' && run.stalls === 0,
  },
  {
    id: 'normalizer',
    name: 'Normalizer',
    desc: 'Reach 3NF in Zone 4 with no wasted moves.',
    zone: 'z4',
    // run.wastedMoves is set by the Normalization Lab (M3); locked until then.
    test: (run) => run.zoneId === 'z4' && run.wastedMoves === 0,
  },
  {
    id: 'architect',
    name: 'Architect',
    desc: 'Pick the best-fit deployment in Zone 5.',
    zone: 'z5',
    // run.bestFit is set by the Architecture Builder (M3); locked until then.
    test: (run) => run.zoneId === 'z5' && run.bestFit === true,
  },
  {
    id: 'shipper',
    name: 'Shipper',
    desc: 'Complete the capstone and ship your app.',
    // The capstone run is flagged isCapstone by META-1; locked until then.
    test: (run) => run.isCapstone === true,
  },
  {
    id: 'flawless',
    name: 'Flawless',
    desc: 'Finish any zone with 100% accuracy.',
    test: (run) => isPerfect(run),
  },
  {
    id: 'comeback',
    name: 'Comeback',
    desc: 'Win a boss encounter on your last life.',
    test: (run) => run.isBoss === true && run.lives === 1,
  },
];

// Returns the ids of every badge whose predicate passes for this run. Each test
// is guarded so a faulty predicate can never break run completion.
export function evaluateBadges(run) {
  if (!run) return [];
  const earned = [];
  for (const badge of BADGES) {
    try {
      if (badge.test(run)) earned.push(badge.id);
    } catch {
      // Ignore a misbehaving predicate; it just won't award.
    }
  }
  return earned;
}
