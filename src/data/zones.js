// Zone metadata + unlock order (SYS-9).
//
// The single source of truth for which zones exist and in what order they
// unlock. The game reducer seeds per-zone progress from ZONE_IDS; screens use
// the names/themes/accents. Full content (challenge banks) lives separately in
// data/challenges/ and is added per zone in M3 (CONTENT-Z*).
//
// `accent` is the design-token color family (see tailwind.config.js) so a zone
// can theme its accent via the --color-accent override.

export const ZONES = [
  {
    id: 'z1',
    name: 'The Wire',
    theme: 'How the web works',
    accent: 'zone1',
    order: 1,
  },
  {
    id: 'z2',
    name: 'The Frontier',
    theme: 'Frontend / React',
    accent: 'zone2',
    order: 2,
  },
  {
    id: 'z3',
    name: 'The Engine Room',
    theme: 'Node.js',
    accent: 'zone3',
    order: 3,
  },
  {
    id: 'z4',
    name: 'The Vault',
    theme: 'Databases',
    accent: 'zone4',
    order: 4,
  },
  {
    id: 'z5',
    name: 'The Launchpad',
    theme: 'Deployment',
    accent: 'zone5',
    order: 5,
  },
];

// Zone ids in unlock order.
export const ZONE_IDS = ZONES.map((z) => z.id);

// Look up a single zone's metadata by id (or null).
export function getZone(id) {
  return ZONES.find((z) => z.id === id) ?? null;
}
