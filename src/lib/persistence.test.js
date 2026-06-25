import { describe, it, expect, beforeEach } from 'vitest';
import {
  save,
  loadDurable,
  clear,
  toJSON,
  isStorageAvailable,
} from './persistence.js';
import { STORAGE_KEY } from '../appConfig.js';

// Minimal localStorage stub on globalThis.window for the Node test env.
beforeEach(() => {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
  };
});

const state = {
  // transient — must NOT persist:
  flow: 'PLAYING',
  overlay: null,
  zoneId: 'z1',
  run: { foo: 1 },
  // durable:
  player: { xp: 50 },
  zones: { z1: { unlocked: true } },
  badges: ['flawless'],
  reviewQueue: [{ id: 'a', remaining: 2 }],
  settings: { sound: true, reducedMotion: false },
};

describe('persistence', () => {
  it('detects available storage', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('round-trips only the durable slices', () => {
    save(state);
    const loaded = loadDurable();
    expect(loaded.player).toEqual({ xp: 50 });
    expect(loaded.reviewQueue).toEqual([{ id: 'a', remaining: 2 }]);
    // transient fields are excluded
    expect(loaded.run).toBeUndefined();
    expect(loaded.flow).toBeUndefined();
  });

  it('returns null for corrupt or wrong-version saves', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(loadDurable()).toBe(null);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 999, data: { player: {}, zones: {} } })
    );
    expect(loadDurable()).toBe(null);
  });

  it('clear() removes the save', () => {
    save(state);
    clear();
    expect(loadDurable()).toBe(null);
  });

  it('toJSON wraps a versioned envelope', () => {
    const parsed = JSON.parse(toJSON(state));
    expect(parsed.version).toBeTypeOf('number');
    expect(parsed.data.player).toEqual({ xp: 50 });
  });
});
