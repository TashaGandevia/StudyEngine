// App identity (engine-level, subject-neutral).
//
// One place for the product's name and storage identity, so rebranding or
// shipping a differently-named build is a single edit. Topic-specific content
// lives in the content pack (data/contentPack.js), not here.
export const APP_NAME = 'Study Engine';
export const TAGLINE = 'A gamified study engine.';

// Slug used for the localStorage key and the export filename. Changing it
// starts saves fresh (old keys are simply ignored).
export const APP_SLUG = 'study-engine';
export const STORAGE_KEY = `${APP_SLUG}:save`;
export const SAVE_FILENAME = `${APP_SLUG}-save.json`;
