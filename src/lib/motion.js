// Shared animation presets (INF-3).
//
// Each preset is a plain object whose keys (initial/animate/exit/transition)
// can be spread directly onto a Framer Motion component:
//
//   import { motion } from 'framer-motion';
//   import { slideUp } from '../lib/motion';
//   <motion.div {...slideUp}>...</motion.div>
//
// Centralizing them keeps motion consistent (timing, easing, direction) across
// every screen and mini-game. Reduced-motion handling is NOT done per-preset:
// MotionProvider (see components/MotionProvider.jsx) wraps the app in a
// <MotionConfig> that automatically tones these down when the user prefers
// reduced motion, so authors can use presets freely.

// Shared easing curve (ease-out, slight overshoot feel) and standard durations.
export const EASE = [0.16, 1, 0.3, 1];
export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
};

// Simple opacity fade — good default for mounting/unmounting content.
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.base },
};

// Rise + fade — for cards and panels entering the screen.
export const slideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: DURATION.base, ease: EASE },
};

// Directional slide factory. `direction` is where the element comes FROM.
// e.g. slide('right') enters from the right edge. `distance` in px.
export function slide(direction = 'left', distance = 24) {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'left' || direction === 'up' ? -1 : 1;
  const offset = sign * distance;
  return {
    initial: { opacity: 0, [axis]: offset },
    animate: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: offset },
    transition: { duration: DURATION.base, ease: EASE },
  };
}

// Card flip — used for reveal/answer mechanics (e.g. flashcard-style cards).
// The element should have a perspective set on its parent for best effect.
export const cardFlip = {
  initial: { rotateY: -90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: 90, opacity: 0 },
  transition: { duration: DURATION.slow, ease: EASE },
};

// Pulse — a quick scale bump for positive feedback (correct answer, combo tick,
// "on fire" flourish). Spread onto a motion component and trigger via `animate`.
export const pulse = {
  animate: { scale: [1, 1.08, 1] },
  transition: { duration: 0.4, ease: 'easeInOut' },
};
