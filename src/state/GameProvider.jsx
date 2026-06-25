// GameProvider (SYS-1) — owns the global game state and exposes the action API.
//
// Runs gameReducer via useReducer and publishes, through context, the current
// state plus named action helpers. It does NOT expose raw dispatch: mini-games
// receive only the gameplay helpers (answer/completeRun) as their
// onAnswer/onComplete callbacks, so the reducer stays the sole mutator — a
// one-directional data flow (and itself a teachable React pattern).
import { useEffect, useMemo, useReducer } from 'react';
import { EVENT } from './flowMachine.js';
import {
  GAME_ACTION,
  gameReducer,
  createInitialState,
} from './gameReducer.js';
import { GameContext } from './gameContext.js';
import {
  loadDurable,
  save,
  clear,
  downloadSave,
} from '../lib/persistence.js';

// Lazy initializer: start from a fresh state, then overlay any saved durable
// progress. Per-zone merge keeps existing saves valid if new zones are added
// later. Transient fields (flow/overlay/run) always come from the fresh state.
function initState() {
  const fresh = createInitialState();
  const saved = loadDurable();
  if (!saved) return fresh;

  const zones = { ...fresh.zones };
  for (const id of Object.keys(fresh.zones)) {
    if (saved.zones?.[id]) zones[id] = { ...fresh.zones[id], ...saved.zones[id] };
  }

  return {
    ...fresh,
    player: { ...fresh.player, ...saved.player },
    zones,
    badges: Array.isArray(saved.badges) ? saved.badges : fresh.badges,
    reviewQueue: Array.isArray(saved.reviewQueue)
      ? saved.reviewQueue
      : fresh.reviewQueue,
    settings: { ...fresh.settings, ...saved.settings },
  };
}

export default function GameProvider({ children }) {
  // Third arg = lazy initializer; runs once to rehydrate from localStorage.
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);

  // Persist whenever durable progress changes. Depending on the specific
  // slices avoids re-saving on transient flow/overlay/run churn.
  useEffect(() => {
    save(state);
    // Intentionally keyed to the durable slices, not `state`: this skips saves
    // on transient flow/overlay/run churn. The effect still closes over the
    // latest `state` whenever any listed slice changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.player,
    state.zones,
    state.badges,
    state.reviewQueue,
    state.settings,
  ]);

  // Action helpers, memoized so the context value stays stable across renders.
  const value = useMemo(() => {
    const fire = (type, extra) => dispatch({ type, ...extra });
    return {
      ...state,

      // --- Flow / navigation (delegated to the flow machine) ---
      startNew: () => fire(EVENT.START_NEW),
      continueGame: () => fire(EVENT.CONTINUE),
      finishOnboarding: () => fire(EVENT.FINISH_ONBOARDING),
      selectZone: (zoneId) => fire(EVENT.SELECT_ZONE, { zoneId }),
      startZone: () => fire(EVENT.START_ZONE),
      startBoss: () => fire(EVENT.START_BOSS),
      winBoss: () => fire(EVENT.WIN_BOSS),
      retryBoss: () => fire(EVENT.RETRY_BOSS),
      finishResults: () => fire(EVENT.FINISH_RESULTS),
      replayZone: () => fire(EVENT.REPLAY_ZONE),
      startCapstone: () => fire(EVENT.START_CAPSTONE),
      finishCapstone: () => fire(EVENT.FINISH_CAPSTONE),
      exitEnd: () => fire(EVENT.EXIT_END),
      openPause: () => fire(EVENT.OPEN_PAUSE),
      closePause: () => fire(EVENT.CLOSE_PAUSE),
      openProfile: () => fire(EVENT.OPEN_PROFILE),
      closeProfile: () => fire(EVENT.CLOSE_PROFILE),

      // --- Gameplay (the only way mini-games affect state) ---
      // Start a round. opts: { isBoss?, queue? }
      startRun: (zoneId, opts = {}) =>
        fire(GAME_ACTION.START_RUN, { zoneId, ...opts }),
      // onAnswer callback. result: { correct, challengeId?, difficulty? }
      answer: (result) => fire(GAME_ACTION.ANSWER, result),
      // onComplete callback.
      completeRun: () => fire(GAME_ACTION.COMPLETE_RUN),
      abandonRun: () => fire(GAME_ACTION.ABANDON_RUN),
      setSetting: (key, val) => fire(GAME_ACTION.SET_SETTING, { key, value: val }),

      // --- Persistence controls (SYS-2) ---
      // Wipe the save AND reset in-memory state to a brand-new game.
      resetGame: () => {
        clear();
        fire(GAME_ACTION.RESET);
      },
      // Download the current durable progress as a JSON file (backup/inspect).
      exportSave: () => downloadSave(state),
    };
  }, [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
