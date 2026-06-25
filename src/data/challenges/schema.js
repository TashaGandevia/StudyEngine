// Challenge schema (SYS-9) — the contract every content file follows.
//
// Each challenge is a plain object with a shared core plus type-specific fields.
// `type` selects which mini-game component renders it (see minigames/registry).
// Content lives in data/challenges/<zone>.js as arrays of these objects.
//
// @typedef {Object} Challenge
// @property {string}  id          Unique id, e.g. "z1_004".
// @property {string}  zone        Zone id, e.g. "z1".
// @property {string}  type        Mini-game type key, e.g. "status_sort".
// @property {('easy'|'med'|'hard')} difficulty
// @property {string}  [prompt]    The question/scenario shown to the player.
// @property {*}        [answer]    The correct answer (shape depends on type).
// @property {string}  [explain]   One-line reinforcement shown after answering.
// @property {*}        [..type]    Any type-specific fields (group, choices,
//                                  code, gaps, columns, functionalDeps, ...).

export const DIFFICULTIES = ['easy', 'med', 'hard'];

// A fully-worked reference challenge (from the GDD) showing the schema in use.
export const EXAMPLE_CHALLENGE = {
  id: 'z1_004',
  zone: 'z1',
  type: 'status_sort',
  difficulty: 'med',
  prompt: 'The page has permanently moved to a new URL.',
  answer: '301',
  group: '3xx',
  explain: '3xx = redirection; 301 = Moved Permanently.',
};

// Validates the required core fields of a challenge. Type-specific fields are
// validated by their own mini-game. Returns true if the object is usable.
export function isValidChallenge(c) {
  return (
    !!c &&
    typeof c.id === 'string' &&
    typeof c.zone === 'string' &&
    typeof c.type === 'string' &&
    DIFFICULTIES.includes(c.difficulty)
  );
}
