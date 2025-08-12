import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Keep code clean but avoid failing CI on harmless unused vars during rapid iteration
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      // Allow empty catch blocks (often used to probe features) but warn otherwise
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Node context for build scripts and config files
  {
    files: ['scripts/**/*.js', 'vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
