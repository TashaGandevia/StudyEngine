// Vite build/dev-server configuration (also drives Vitest).
// The React plugin enables JSX transform and Fast Refresh (hot reloading) in dev.
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vitest: the engine is pure JS, so the default Node environment is enough.
  // Test files live next to the code as *.test.js.
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
});
