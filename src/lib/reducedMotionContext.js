// Reduced-motion context + hook (INF-3).
//
// Split out from MotionProvider so that the provider file exports only a
// component (keeps React Fast Refresh happy). MotionProvider supplies the
// value; components read it via useReducedMotionPref to decide whether to skip
// an animation entirely. Defaults to false (animate) until a provider is set.
import { createContext, useContext } from 'react';

export const ReducedMotionContext = createContext(false);

// Returns true when motion should be minimized (OS preference OR in-app override).
export function useReducedMotionPref() {
  return useContext(ReducedMotionContext);
}
