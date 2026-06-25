// ProgressBar — a horizontal fill bar (INF-2).
//
// Drives the XP bar, stack-completion %, round progress, etc. Give it `value`
// and `max`; it renders an accent-filled track clamped to 0–100%. The fill uses
// the accent token, so a zone screen that overrides --color-accent gets a
// zone-colored bar for free. Includes ARIA progressbar semantics for a11y.

export default function ProgressBar({
  value = 0,
  max = 100,
  className = '',
  label,
  ...props
}) {
  // Guard against divide-by-zero / out-of-range values, then clamp to [0, 100].
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={[
        'h-2.5 w-full overflow-hidden rounded-full bg-surface-muted',
        className,
      ].join(' ')}
      {...props}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
