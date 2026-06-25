// MotionProvider — the app-wide reduced-motion guard (INF-3).
//
// Wraps the tree in Framer Motion's <MotionConfig>, which makes every motion
// component respect the user's motion preference without per-component code:
//   - reducedMotion="user"   → honor the OS `prefers-reduced-motion` setting
//   - reducedMotion="always" → force-reduce regardless (for the in-app setting)
// When reduced, transform/layout animations are skipped while opacity fades are
// kept, so the UI stays calm but not jarringly static.
//
// `forceReduced` lets a caller override based on app state. M1's
// settings.reducedMotion will be passed in here once game state exists.
//
// The effective "should I animate at all?" boolean is published through
// ReducedMotionContext; components read it via useReducedMotionPref (see
// lib/reducedMotionContext.js) to render static fallbacks when needed.
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ReducedMotionContext } from '../lib/reducedMotionContext.js';

export default function MotionProvider({ forceReduced = false, children }) {
  // Reactive OS-level preference (updates if the user changes their setting).
  const prefersReduced = useReducedMotion();
  const reduced = forceReduced || Boolean(prefersReduced);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion={forceReduced ? 'always' : 'user'}>
        {children}
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}
