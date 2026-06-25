// Flow state machine (INF-4) — the top-level navigation logic for the app.
//
// This is a pure module (no React) so it's easy to reason about and test. It
// owns ONLY which screen is shown, not gameplay data. SYS-1 (M1) introduces the
// full game-state reducer and will integrate this flow field into it.
//
// Design: transitions are a declarative table keyed by [currentState][event].
// A reducer looks up the table; unknown transitions are ignored (with a dev
// warning) so a stray dispatch can never put the app in an invalid screen.

// The flow states. PLAYING/BOSS render mini-games (M2/M3); the rest are screens.
export const FLOW = {
  TITLE: 'TITLE',
  ONBOARDING: 'ONBOARDING',
  OVERWORLD: 'OVERWORLD',
  ZONE_INTRO: 'ZONE_INTRO',
  PLAYING: 'PLAYING',
  BOSS: 'BOSS',
  RESULTS: 'RESULTS',
  CAPSTONE: 'CAPSTONE',
  END: 'END',
};

// Overlays suspend the current flow state without leaving it. null = no overlay.
export const OVERLAY = {
  PAUSED: 'PAUSED',
  PROFILE: 'PROFILE',
};

// Events that drive transitions. Kept as constants to avoid typo'd dispatches.
export const EVENT = {
  // Flow transitions
  START_NEW: 'START_NEW',
  CONTINUE: 'CONTINUE',
  FINISH_ONBOARDING: 'FINISH_ONBOARDING',
  SELECT_ZONE: 'SELECT_ZONE',
  START_ZONE: 'START_ZONE',
  START_BOSS: 'START_BOSS',
  WIN_BOSS: 'WIN_BOSS',
  RETRY_BOSS: 'RETRY_BOSS',
  FINISH_RESULTS: 'FINISH_RESULTS',
  REPLAY_ZONE: 'REPLAY_ZONE',
  START_CAPSTONE: 'START_CAPSTONE',
  FINISH_CAPSTONE: 'FINISH_CAPSTONE',
  EXIT_END: 'EXIT_END',
  // Overlay toggles
  OPEN_PAUSE: 'OPEN_PAUSE',
  CLOSE_PAUSE: 'CLOSE_PAUSE',
  OPEN_PROFILE: 'OPEN_PROFILE',
  CLOSE_PROFILE: 'CLOSE_PROFILE',
};

// Allowed flow transitions: TRANSITIONS[fromState][event] = toState.
// Mirrors the GDD flow diagram (§2.3).
const TRANSITIONS = {
  [FLOW.TITLE]: {
    [EVENT.START_NEW]: FLOW.ONBOARDING,
    [EVENT.CONTINUE]: FLOW.OVERWORLD,
  },
  [FLOW.ONBOARDING]: {
    [EVENT.FINISH_ONBOARDING]: FLOW.OVERWORLD,
  },
  [FLOW.OVERWORLD]: {
    [EVENT.SELECT_ZONE]: FLOW.ZONE_INTRO,
    [EVENT.START_CAPSTONE]: FLOW.CAPSTONE,
  },
  [FLOW.ZONE_INTRO]: {
    [EVENT.START_ZONE]: FLOW.PLAYING,
  },
  [FLOW.PLAYING]: {
    [EVENT.START_BOSS]: FLOW.BOSS,
  },
  [FLOW.BOSS]: {
    [EVENT.WIN_BOSS]: FLOW.RESULTS,
    [EVENT.RETRY_BOSS]: FLOW.BOSS, // failing a boss retries the boss, not the zone
  },
  [FLOW.RESULTS]: {
    [EVENT.FINISH_RESULTS]: FLOW.OVERWORLD,
    [EVENT.REPLAY_ZONE]: FLOW.ZONE_INTRO,
  },
  [FLOW.CAPSTONE]: {
    [EVENT.FINISH_CAPSTONE]: FLOW.END,
  },
  [FLOW.END]: {
    [EVENT.EXIT_END]: FLOW.OVERWORLD,
  },
};

// Events that return the player to the overworld and so clear the active zone.
const ZONE_CLEARING_EVENTS = new Set([EVENT.FINISH_RESULTS, EVENT.EXIT_END]);

export const initialFlowState = {
  flow: FLOW.TITLE,
  overlay: null, // OVERLAY.PAUSED | OVERLAY.PROFILE | null
  zoneId: null, // which zone the current ZONE_INTRO/PLAYING/BOSS/RESULTS is for
};

export function flowReducer(state, action) {
  switch (action.type) {
    // --- Overlay handling: change `overlay` only, leave `flow` suspended. ---
    case EVENT.OPEN_PAUSE:
      return { ...state, overlay: OVERLAY.PAUSED };
    case EVENT.OPEN_PROFILE:
      return { ...state, overlay: OVERLAY.PROFILE };
    case EVENT.CLOSE_PAUSE:
    case EVENT.CLOSE_PROFILE:
      return { ...state, overlay: null };

    // --- Flow transitions via the table. ---
    default: {
      const next = TRANSITIONS[state.flow]?.[action.type];
      if (!next) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[flow] ignored "${action.type}" — no transition from "${state.flow}"`
          );
        }
        return state;
      }

      // Resolve which zone is active after the transition.
      let zoneId = state.zoneId;
      if (action.type === EVENT.SELECT_ZONE) zoneId = action.zoneId ?? null;
      else if (ZONE_CLEARING_EVENTS.has(action.type)) zoneId = null;

      return { ...state, flow: next, zoneId };
    }
  }
}
