// ComboMeter (SYS-4) — HUD element showing the current streak and multiplier.
//
// Reads run.combo from game state. The fill bar tracks progress toward the cap
// (min(combo, cap)/cap); at the cap the multiplier maxes at ×2 and the meter
// switches to the "on fire" treatment (coral + flame + a pulse). Renders
// nothing when there's no active run.
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/gameContext.js';
import { COMBO_CAP, comboMultiplier, isOnFire } from '../lib/combo.js';

export default function ComboMeter() {
  const { run } = useGame();
  if (!run) return null;

  const combo = run.combo;
  const mult = comboMultiplier(combo);
  const onFire = isOnFire(combo);
  const fill = Math.min(combo, COMBO_CAP) / COMBO_CAP;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Combo {combo}</span>
        {/* Keyed by mult so the multiplier badge pops each time it changes. */}
        <motion.span
          key={mult}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          className={onFire ? 'font-bold text-zone5-500' : 'text-text-muted'}
        >
          ×{mult.toFixed(1)}
        </motion.span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <motion.div
          className={`h-full rounded-full ${onFire ? 'bg-zone5-500' : 'bg-accent'}`}
          animate={{ width: `${fill * 100}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>

      {/* "On fire" flourish appears once the multiplier is maxed. */}
      <AnimatePresence>
        {onFire && (
          <motion.div
            key="on-fire"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs font-bold uppercase tracking-wide text-zone5-500"
          >
            🔥 On fire!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
