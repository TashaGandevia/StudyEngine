// Badge definitions (example content pack) — data, not engine.
//
// Each badge is { id, name, desc, zone?, test(run) }. The test predicate
// receives the finished run (see gameReducer COMPLETE_RUN) and returns true if
// earned. The engine runs these via lib/badges.js evaluateBadges().
//
// These starter badges are MECHANICAL — they depend only on engine-level run
// fields (accuracy, boss/lives, capstone), so they work for any subject. A
// subject-specific content pack can add topic badges here (e.g. predicates that
// read mini-game-specific fields a particular mini-game sets on the run).

// Helper: did the run get everything right?
const isPerfect = (run) => run.total > 0 && run.correct === run.total;

export const BADGES = [
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
  {
    id: 'shipper',
    name: 'Shipper',
    desc: 'Complete the capstone.',
    // The capstone run is flagged isCapstone by the capstone screen (M4).
    test: (run) => run.isCapstone === true,
  },
];
