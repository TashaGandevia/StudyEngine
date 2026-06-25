// Mini-game type router (SYS-9) — maps a challenge `type` to its component.
//
// Every mini-game follows the same contract so they're swappable:
//   <MiniGame challenge={challengeObject}
//             onAnswer={(isCorrect, meta) => {}}   // updates combo/XP/review
//             onComplete={() => {}} />             // round finished
//
// M3 mini-games register themselves by adding to MINIGAME_REGISTRY, e.g.:
//   import StatusCodeSorter from './StatusCodeSorter.jsx';
//   status_sort: StatusCodeSorter,
// Until a type is registered, resolveMiniGame falls back to FallbackChallenge
// so the run stays playable.
import FallbackChallenge from './FallbackChallenge.jsx';

// type (string) → mini-game component. Filled in across M3.
export const MINIGAME_REGISTRY = {};

// Returns the component for a challenge type, or the fallback if unregistered.
export function resolveMiniGame(type) {
  return MINIGAME_REGISTRY[type] ?? FallbackChallenge;
}
