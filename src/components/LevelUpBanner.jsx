// LevelUpBanner (SYS-3) — a transient celebratory banner shown when the
// player's level increases.
//
// Level is derived from lifetime XP, which only changes at COMPLETE_RUN, so a
// level-up is detected by comparing the current derived level against the
// previous one. A ref seeds the "previous" value on mount so an existing save
// (loaded at a high level) doesn't trigger a banner on first render.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/gameContext.js';
import { levelFromXp } from '../lib/leveling.js';
import { EASE } from '../lib/motion.js';

export default function LevelUpBanner() {
  const { player } = useGame();
  const level = levelFromXp(player.xp).level;

  const prevLevel = useRef(level); // seeded to current → no banner on load
  const [shownLevel, setShownLevel] = useState(null);

  useEffect(() => {
    if (level > prevLevel.current) {
      setShownLevel(level);
      const t = setTimeout(() => setShownLevel(null), 2600);
      prevLevel.current = level;
      return () => clearTimeout(t);
    }
    // Keep the ref in sync even when the level drops (e.g. after a reset).
    prevLevel.current = level;
  }, [level]);

  return (
    <AnimatePresence>
      {shownLevel !== null && (
        <motion.div
          key={shownLevel}
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-full bg-accent px-5 py-2 font-semibold text-accent-contrast shadow-lg">
            Level up! You reached level {shownLevel}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
