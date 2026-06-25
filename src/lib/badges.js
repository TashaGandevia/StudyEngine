// Badge evaluation (engine) — pure, no content baked in.
//
// The mechanical logic of "which of these badges did this run earn?" lives in
// the engine; the badge DEFINITIONS (data + predicates) come from the content
// pack. Each predicate is guarded so a faulty one can never break run
// completion.
export function evaluateBadges(badges, run) {
  if (!run || !Array.isArray(badges)) return [];
  const earned = [];
  for (const badge of badges) {
    try {
      if (badge.test(run)) earned.push(badge.id);
    } catch {
      // Ignore a misbehaving predicate; it just won't award.
    }
  }
  return earned;
}
