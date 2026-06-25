// Persistence (SYS-2) — save/restore durable progress to localStorage.
//
// Only DURABLE progress is persisted (player, zones, badges, reviewQueue,
// settings); the transient session (flow/overlay/run) is intentionally left
// out so a reload starts fresh on the Title screen rather than dropping the
// player back into a half-finished run.
//
// Per GDD §3.8, localStorage may be unavailable (e.g. an in-chat artifact). All
// access is guarded so the app degrades to in-memory-only state and can still
// offer Export.

const STORAGE_KEY = 'full-stack-quest:save';
// Bump when the durable shape changes incompatibly; old saves are then ignored
// (a migration could be added here instead of discarding).
const SCHEMA_VERSION = 1;

// Keys of the game state that make up durable progress.
const DURABLE_KEYS = ['player', 'zones', 'badges', 'reviewQueue', 'settings'];

// Returns true if localStorage can actually be read/written (it can exist but
// throw in private mode or be absent entirely).
export function isStorageAvailable() {
  try {
    const k = '__fsq_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// Extracts just the durable slice of game state.
function pickDurable(state) {
  const data = {};
  for (const key of DURABLE_KEYS) data[key] = state[key];
  return data;
}

// Serializes durable progress to a versioned envelope (also used for Export).
export function toJSON(state, pretty = false) {
  const envelope = { version: SCHEMA_VERSION, data: pickDurable(state) };
  return JSON.stringify(envelope, null, pretty ? 2 : undefined);
}

// Writes durable progress to localStorage. No-op (and never throws) when
// storage is unavailable or the write fails (e.g. quota).
export function save(state) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, toJSON(state));
  } catch {
    // Ignore: a failed save shouldn't break gameplay.
  }
}

// Reads durable progress. Returns the data object, or null when there's no save
// or it's missing/corrupt/an incompatible version.
export function loadDurable() {
  if (!isStorageAvailable()) return null;
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    // Validate envelope + version + basic shape before trusting it.
    if (
      !parsed ||
      parsed.version !== SCHEMA_VERSION ||
      typeof parsed.data !== 'object' ||
      parsed.data === null ||
      typeof parsed.data.player !== 'object' ||
      typeof parsed.data.zones !== 'object'
    ) {
      return null;
    }
    return parsed.data;
  } catch {
    // Corrupt JSON — discard so the player just starts fresh.
    return null;
  }
}

// Deletes the save (used by the Reset control).
export function clear() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

// Triggers a browser download of the current save as a JSON file. Guarded so it
// safely no-ops in non-DOM environments.
export function downloadSave(state) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([toJSON(state, true)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'full-stack-quest-save.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
