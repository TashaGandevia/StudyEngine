// Run builder (SYS-9) — assembles the ordered challenge queue for a round.
//
// buildRun pulls from a zone's challenge bank, optionally weights in items from
// the review queue (spaced repetition), and orders the rest along a difficulty
// curve. The result is the list of challenge objects a mini-game round plays
// through (stored as run state via START_RUN).
import { ALL_CHALLENGES, challengesForZone } from '../data/challenges/index.js';
import { shuffle } from './rng.js';

/**
 * @param {string} zoneId
 * @param {Object} [opts]
 * @param {number}   [opts.count=6]          How many challenges in the round.
 * @param {string[]} [opts.difficultyCurve]  Desired difficulty per slot, e.g.
 *                                            ['easy','easy','med','med','hard'].
 * @param {number}   [opts.reviewBias=0]      0–1 fraction of slots to fill from
 *                                            the review queue when possible.
 * @param {string[]} [opts.reviewIds=[]]      Ids currently in the review queue.
 * @param {Challenge[]} [opts.pool]           Override source (defaults to the
 *                                            zone bank); also used as the
 *                                            lookup table for reviewIds.
 * @param {() => number} [opts.rng]           RNG for shuffling (default random).
 * @returns {Challenge[]} the ordered run queue.
 */
export function buildRun(
  zoneId,
  {
    count = 6,
    difficultyCurve = null,
    reviewBias = 0,
    reviewIds = [],
    pool = null,
    rng = Math.random,
  } = {}
) {
  const zoneChallenges = pool ?? challengesForZone(zoneId);
  // Review items may come from any zone, so look them up across all content
  // (or the provided pool in tests).
  const lookup = pool ?? ALL_CHALLENGES;

  const queue = [];

  // 1) Reserve some slots for review items (capped by how many actually exist).
  const reviewPool = reviewIds
    .map((id) => lookup.find((c) => c.id === id))
    .filter(Boolean);
  const reviewSlots = Math.min(
    reviewPool.length,
    Math.round(count * reviewBias)
  );
  queue.push(...shuffle(reviewPool, rng).slice(0, reviewSlots));

  // 2) Fill the remaining slots from the zone bank (excluding anything already
  //    queued), honoring the difficulty curve when one is given.
  const remaining = count - queue.length;
  const available = shuffle(
    zoneChallenges.filter((c) => !queue.some((q) => q.id === c.id)),
    rng
  );

  if (difficultyCurve && difficultyCurve.length) {
    for (let i = 0; i < remaining; i++) {
      const want = difficultyCurve[Math.min(i, difficultyCurve.length - 1)];
      // Prefer a challenge of the requested difficulty; otherwise take any.
      const idx = available.findIndex((c) => c.difficulty === want);
      const pick = idx >= 0 ? available.splice(idx, 1)[0] : available.shift();
      if (pick) queue.push(pick);
    }
  } else {
    queue.push(...available.slice(0, remaining));
  }

  return queue;
}
