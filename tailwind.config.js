/**
 * Tailwind CSS configuration — the project's design-token source of truth (INF-2).
 *
 * Two kinds of color tokens live here:
 *
 *  1. Semantic tokens (`bg`, `surface`, `text`, `accent`, ...) map to CSS
 *     variables defined in src/index.css. Because they resolve at runtime, the
 *     same utility class (e.g. `bg-surface`) automatically flips between light
 *     and dark themes when the `dark` class is toggled on <html>.
 *
 *  2. Zone ramps (`zone1`..`zone5`) are fixed palettes — one per GDD zone
 *     (blue / purple / teal / amber / coral). These give every zone a
 *     consistent identity the player can navigate by.
 *
 * `darkMode: 'class'` means dark mode is opt-in via a `dark` class rather than
 * the OS preference, so the in-game settings toggle (UI-9) can control it.
 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // --- Semantic tokens (theme-aware via CSS variables) ---
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          contrast: 'var(--color-accent-contrast)',
        },

        // --- Zone ramps (fixed; one identity color per zone) ---
        // Zone 1 · The Wire — blue
        zone1: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Zone 2 · The Frontier — purple
        zone2: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Zone 3 · The Engine Room — teal
        zone3: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Zone 4 · The Vault — amber
        zone4: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Zone 5 · The Launchpad — coral
        zone5: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc7c0',
          300: '#ffa194',
          400: '#ff6f5c',
          500: '#f9482b',
          600: '#e23018',
          700: '#bd2412',
          800: '#9b2114',
          900: '#801f16',
        },
      },
      fontFamily: {
        // Inter is loaded via index.html; the rest is a graceful system fallback.
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        // System monospace stack for the Code Lab — no extra font download.
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
