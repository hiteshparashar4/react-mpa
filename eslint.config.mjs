import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import cssPlugin from '@eslint/css'; // Not a plugin but provides config
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.log',
      '*.tmp',
      '*.md',
      'coverage/',
      'webpack-stats.json',
      '.dockerignore',
      'Dockerfile',
      '.gitignore'
    ],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      js,
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,

      // Style rules
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],

      // Optional tweaks
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },

  // ✅ CSS linting (config only, no plugin needed)
  {
    files: ['**/*.css'],
    ...cssPlugin.configs.recommended,
  },
]);
