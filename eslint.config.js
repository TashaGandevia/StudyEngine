// ESLint flat configuration (ESLint 9+).
//
// Layers: JS recommended rules, React + React Hooks rules, and the React Fast
// Refresh rule (warns about exports that would break hot reloading). The
// prettier config is applied LAST to turn off any stylistic rules that would
// conflict with Prettier — Prettier owns formatting, ESLint owns correctness.
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  // Don't lint build output or dependencies.
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // The new JSX transform makes importing React in scope unnecessary.
      'react/react-in-jsx-scope': 'off',
      // This is a plain-JS project (no PropTypes / TypeScript), so prop-type
      // validation is intentionally not enforced.
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  prettier,
];
