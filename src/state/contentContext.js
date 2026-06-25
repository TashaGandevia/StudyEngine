// Content context + hook.
//
// The content pack (zones, badges, challenges, mini-game router) is injected
// into GameProvider at the app root and published here so descendant components
// (BadgeShelf, zone screens, the mini-game shell, ...) can read subject content
// without importing it directly. This is what keeps the engine swappable: the
// core never hard-imports a particular subject's data.
import { createContext, useContext } from 'react';

export const ContentContext = createContext(null);

// Returns the active content pack. Throws if used outside <GameProvider>.
export function useContent() {
  const ctx = useContext(ContentContext);
  if (ctx === null) {
    throw new Error('useContent must be used within a <GameProvider>');
  }
  return ctx;
}
