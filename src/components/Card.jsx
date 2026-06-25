// Card — a surface container for grouping content (INF-2).
//
// Used for zone intro cards, results panels, onboarding cards, etc. It's a thin
// styled <div>: rounded surface, border, and padding. `as` lets callers swap
// the element (e.g. a <section> or <article>) without losing the styling.

export default function Card({
  as: Tag = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={[
        'bg-surface text-text border border-border rounded-xl p-5 shadow-sm',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
