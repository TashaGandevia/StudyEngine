// Pill — a small rounded label/tag (INF-2).
//
// Used for badges, concept tags, difficulty markers, status chips, etc.
// `tone` picks the color treatment:
//   neutral → muted surface (default)
//   accent → current accent color, for emphasis
// Zone-colored pills can be made by passing zone utility classes via className
// (e.g. <Pill className="bg-zone3-100 text-zone3-700" />).

const TONES = {
  neutral: 'bg-surface-muted text-text-muted',
  accent: 'bg-accent text-accent-contrast',
};

export default function Pill({
  tone = 'neutral',
  className = '',
  children,
  ...props
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
