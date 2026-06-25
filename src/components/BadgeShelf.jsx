// BadgeShelf (SYS-7) — lists the starter badge set, marking which are earned.
//
// Data-driven: it renders straight from the BADGES definitions and the player's
// owned ids, so adding a badge in data/badges.js shows up here automatically.
// UI-8 builds the full profile/badge UI; this is the testable baseline.
import { useGame } from '../state/gameContext.js';
import { BADGES } from '../data/badges.js';

export default function BadgeShelf() {
  const { badges } = useGame();
  const owned = new Set(badges);

  return (
    <ul className="flex flex-col gap-2">
      {BADGES.map((badge) => {
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
