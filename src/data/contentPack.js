// Content pack (the binding layer between engine and subject content).
//
// A content pack is the ONLY thing the engine needs to teach a subject. It
// bundles the zones, badges, challenges, and mini-game router into one object
// that App.jsx injects into <GameProvider>. To retarget the engine to a new
// subject, provide a different object with this same shape — no engine changes.
//
// Shape:
//   { zones, zoneIds, badges, challengesForZone, getChallenge, allChallenges,
//     resolveMiniGame }
import { ZONES, ZONE_IDS } from './zones.js';
import { BADGES } from './badges.js';
import {
  ALL_CHALLENGES,
  challengesForZone,
  getChallenge,
} from './challenges/index.js';
import { resolveMiniGame } from '../minigames/registry.js';
import { buildRun } from '../lib/buildRun.js';

export const exampleContent = {
  zones: ZONES,
  zoneIds: ZONE_IDS,
  badges: BADGES,
  challengesForZone,
  getChallenge,
  allChallenges: ALL_CHALLENGES,
  resolveMiniGame,
};

// Content-aware wrapper around the pure buildRun: resolves a zone's challenges
// and the review candidates from a content pack, then assembles the round.
// `reviewIds` come from the review-queue selector (selectReviewIds).
export function buildRunForZone(
  content,
  zoneId,
  { reviewIds = [], ...opts } = {}
) {
  const reviewCandidates = reviewIds
    .map((id) => content.getChallenge(id))
    .filter(Boolean);
  return buildRun({
    zoneChallenges: content.challengesForZone(zoneId),
    reviewCandidates,
    ...opts,
  });
}
