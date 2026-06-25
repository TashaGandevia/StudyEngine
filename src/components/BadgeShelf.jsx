// BadgeShelf (SYS-7) — lists the starter badge set, marking which are earned.
//
// Data-driven: it renders straight from the content pack's badge definitions
// and the player's owned ids, so adding a badge to the pack shows up here
// automatically. UI-8 builds the full profile/badge UI; this is the baseline.
import { useGame } from '../state/gameContext.js';
import { useContent } from '../state/contentContext.js';

export default function BadgeShelf() {
  const { badges } = useGame();
  const { badges: badgeDefs } = useContent();
  const owned = new Set(badges);

  return (
    <ul className="flex flex-col gap-2">
      {badgeDefs.map((badge) => {
        const has = owned.has(badge.id);
        return (
          <li
            key={badge.id}
            className={`flex items-start gap-2 ${has ? '' : 'opacity-40'}`}
          >
            <span aria-hidden>{has ? '🏅' : '🔒'}</span>
            <div>
              <div className="text-sm font-medium">{badge.name}</div>
              <div className="text-xs text-text-muted">{badge.desc}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
