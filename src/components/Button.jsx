// Button — the project's primary interactive control (INF-2).
//
// Variants:
//   primary → accent-filled, for the main action on a screen
//   secondary → surface-filled with a border, for lesser actions
//   ghost → transparent, for low-emphasis / icon-style actions
// Sizes: sm | md | lg.
//
// Colors come from the semantic theme tokens, so buttons adapt to light/dark
// and to the current zone's accent automatically. Any extra className is
// appended last so callers can fine-tune per use.

const VARIANTS = {
  primary: 'bg-accent text-accent-contrast hover:opacity-90 active:opacity-80',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-muted',
  ghost: 'bg-transparent text-text hover:bg-surface-muted',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-base px-4 py-2 rounded-lg',
  lg: 'text-lg px-6 py-3 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        // Shared base: layout, weight, focus ring, disabled state, transition.
        'inline-flex items-center justify-center font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    />
  );
}
