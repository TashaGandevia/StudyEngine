// Zone metadata + unlock order (example content pack).
//
// A "zone" is a topic/unit. This file is CONTENT, not engine: swap it (or
// provide a different content pack) to retarget the game to a new subject. The
// engine only needs `id` + order; screens use the name/theme/accent.
//
// `accent` is the design-token color family (see tailwind.config.js) so each
// zone can theme its accent. Names/themes are neutral placeholders — replace
// them with your subject's units.

export const ZONES = [
  { id: 'z1', name: 'Zone 1', theme: 'Topic 1', accent: 'zone1', order: 1 },
  { id: 'z2', name: 'Zone 2', theme: 'Topic 2', accent: 'zone2', order: 2 },
  { id: 'z3', name: 'Zone 3', theme: 'Topic 3', accent: 'zone3', order: 3 },
  { id: 'z4', name: 'Zone 4', theme: 'Topic 4', accent: 'zone4', order: 4 },
  { id: 'z5', name: 'Zone 5', theme: 'Topic 5', accent: 'zone5', order: 5 },
];

// Zone ids in unlock order.
export const ZONE_IDS = ZONES.map((z) => z.id);

// Look up a single zone's metadata by id (or null).
export function getZone(id) {
  return ZONES.find((z) => z.id === id) ?? null;
}
