// Run builder (engine) — assembles the ordered challenge queue for a round.
//
// Pure and content-free: callers pass the candidate challenge arrays (resolved
// from a content pack), so this never imports subject data. buildRun weights in
// review items (spaced repetition) and orders the rest along a difficulty
// curve. See data/contentPack.js `buildRunForZone` for the content-aware
// wrapper.
import { shuffle } from './rng.js';

/**
 * @param {Object} [opts]
 * @param {Challenge[]} [opts.zoneChallenges]    Challenges available for the zone.
 * @param {Challenge[]} [opts.reviewCandidates]  Full challenge objects eligible
 *                                               for the review bias.
 * @param {number}   [opts.count=6]              How many challenges in the round.
 * @param {string[]} [opts.difficultyCurve]      Desired difficulty per slot, e.g.
 *                                               ['easy','easy','med','med','hard'].
 * @param {number}   [opts.reviewBias=0]         0–1 fraction of slots to fill
 *                                               from review candidates.
 * @param {() => number} [opts.rng]              RNG for shuffling.
 * @returns {Challenge[]} the ordered run queue.
 */
export function buildRun({
  zoneChallenges = [],
  reviewCandidates = [],
  count = 6,
  difficultyCurve = null,
  reviewBias = 0,
  rng = Math.random,
} = {}) {
  const queue = [];

  // 1) Reserve some slots for review items (capped by how many exist).
  const reviewSlots = Math.min(
    reviewCandidates.length,
    Math.round(count * reviewBias)
  );
  queue.push(...shuffle(reviewCandidates, rng).slice(0, reviewSlots));

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
