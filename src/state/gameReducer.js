// Global game reducer (SYS-1) — the single source of truth.
//
// State shape follows the GDD §3.1. Two families of actions flow through here:
//
//   1. Flow/overlay events (from the INF-4 flow machine) — delegated to
//      flowReducer so navigation logic lives in one place.
//   2. Gameplay actions (START_RUN / ANSWER / COMPLETE_RUN / ...) — own the run
//      lifecycle and progression.
//
// IMPORTANT (scope): SYS-1 establishes the structure and wiring. The tuned
// formulas are deliberately left minimal and marked TODO(SYS-x); each is the
// deliverable of a later issue:
//   - XP scaling/curve ........ SYS-3
//   - combo multiplier ........ SYS-4
//   - lives rules ............. SYS-5
//   - scoring / stars ......... SYS-6
//   - badge awards ............ SYS-7
//   - review-queue spacing .... SYS-8
//   - persistence ............. SYS-2
import {
  EVENT,
  flowReducer,
  initialFlowState,
} from './flowMachine.js';
import { xpForAnswer } from '../lib/leveling.js';
import { comboMultiplier } from '../lib/combo.js';

// Gameplay action types (distinct from the flow EVENT names).
export const GAME_ACTION = {
  START_RUN: 'START_RUN',
  ANSWER: 'ANSWER',
  COMPLETE_RUN: 'COMPLETE_RUN',
  ABANDON_RUN: 'ABANDON_RUN',
  SET_SETTING: 'SET_SETTING',
  RESET: 'RESET', // wipe all progress back to a brand-new game (SYS-2)
};

// The set of action types the flow machine handles; everything else is gameplay.
const FLOW_EVENTS = new Set(Object.values(EVENT));

// Zone ids in unlock order. SYS-9 provides the full zone metadata (names,
// concepts, badges); SYS-1 only needs the ids + order to seed progress.
const ZONE_IDS = ['z1', 'z2', 'z3', 'z4', 'z5'];

function makeInitialZones() {
  const zones = {};
  ZONE_IDS.forEach((id, i) => {
    zones[id] = {
      unlocked: i === 0, // only Zone 1 starts unlocked
      completed: false,
      bestAccuracy: 0,
      stars: 0,
    };
  });
  return zones;
}

// Factory (not a shared constant) so each call — initial mount and RESET —
// produces fresh, independent objects with no aliasing between games.
export function createInitialState() {
  return {
    ...initialFlowState, // flow, overlay, zoneId
    // player.xp is the source of truth; level/xpIntoLevel are DERIVED via
    // selectors (SYS-3 owns the leveling experience). Keeping one stored value
    // avoids the two drifting out of sync.
    player: { xp: 0 },
    zones: makeInitialZones(),
    run: null, // the active mini-game session, null when not playing
    badges: [],
    reviewQueue: [],
    settings: { sound: true, reducedMotion: false },
  };
}

export const initialGameState = createInitialState();

export function gameReducer(state, action) {
  // --- Flow/overlay events delegate to the INF-4 flow machine. ---
  if (FLOW_EVENTS.has(action.type)) {
    const flowSlice = flowReducer(
      { flow: state.flow, overlay: state.overlay, zoneId: state.zoneId },
      action
    );
    return { ...state, ...flowSlice };
  }

  // --- Gameplay actions. ---
  switch (action.type) {
    case GAME_ACTION.START_RUN: {
      // action: { zoneId, isBoss?, queue? }
      return {
        ...state,
        run: {
          zoneId: action.zoneId,
          isBoss: Boolean(action.isBoss),
          queue: action.queue ?? [],
          index: 0,
          // Boss runs have 3 lives; normal rounds are forgiving (null = none).
          // SYS-5 hardens the lives rules.
          lives: action.isBoss ? 3 : null,
          combo: 0,
          correct: 0,
          total: 0,
          xpThisRun: 0,
        },
      };
    }

    case GAME_ACTION.ANSWER: {
      // action: { correct, challengeId?, difficulty? } — the onAnswer payload.
      if (!state.run) return state;
      const run = state.run;
      const correct = Boolean(action.correct);

      const combo = correct ? run.combo + 1 : 0; // TODO(SYS-4): multiplier/caps
      const lives =
        !correct && run.isBoss ? Math.max(0, run.lives - 1) : run.lives; // TODO(SYS-5)
      // Base XP × difficulty (SYS-3) × combo multiplier (SYS-4). The multiplier
      // uses the post-increment combo, so a longer streak rewards more; a wrong
      // answer earns 0 regardless (xpForAnswer returns 0).
      const xpGain = Math.round(
        xpForAnswer({ correct, difficulty: action.difficulty }) *
          comboMultiplier(combo)
      );

      const nextRun = {
        ...run,
        index: run.index + 1,
        combo,
        lives,
        correct: run.correct + (correct ? 1 : 0),
        total: run.total + 1,
        xpThisRun: run.xpThisRun + xpGain,
      };

      // On a miss, push the item to the review queue (deduped). SYS-8 adds the
      // "answer correctly twice to clear it" spacing rule.
      const reviewQueue =
        !correct && action.challengeId &&
        !state.reviewQueue.includes(action.challengeId)
          ? [...state.reviewQueue, action.challengeId]
          : state.reviewQueue;

      return { ...state, run: nextRun, reviewQueue };
    }

    case GAME_ACTION.COMPLETE_RUN: {
      // The onComplete payload; finalizes the run into persistent progress.
      if (!state.run) return state;
      const run = state.run;
      const accuracy = run.total > 0 ? run.correct / run.total : 0;

      const zones = { ...state.zones };
      const zone = zones[run.zoneId];
      if (zone) {
        zones[run.zoneId] = {
          ...zone,
          completed: true,
          bestAccuracy: Math.max(zone.bestAccuracy, accuracy),
          // TODO(SYS-6): compute stars from accuracy thresholds (70/85/95%).
        };
      }

      // Unlock the next zone in order (basic progression).
      const idx = ZONE_IDS.indexOf(run.zoneId);
      const nextId = ZONE_IDS[idx + 1];
      if (nextId && zones[nextId]) {
        zones[nextId] = { ...zones[nextId], unlocked: true };
      }

      return {
        ...state,
        zones,
        player: { ...state.player, xp: state.player.xp + run.xpThisRun },
        run: null,
        // TODO(SYS-7): evaluate badge predicates against the finished run here.
      };
    }

    case GAME_ACTION.ABANDON_RUN:
      // Leave a run without recording progress (e.g. quit from pause).
      return { ...state, run: null };

    case GAME_ACTION.RESET:
      // Full wipe to a brand-new game. The provider also clears the save.
      return createInitialState();

    case GAME_ACTION.SET_SETTING:
      // action: { key, value } — e.g. { key: 'sound', value: false }
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
      };

    default:
      if (import.meta.env?.DEV) {
        console.warn(`[game] ignored unknown action "${action.type}"`);
      }
      return state;
  }
}
