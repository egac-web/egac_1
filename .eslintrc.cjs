module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  plugins: ['prettier', 'react'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        extraFileExtensions: ['.astro'],
      },
      plugins: ['astro'],
      extends: ['plugin:astro/recommended'],
      rules: {
        // .astro files use directives and non-react attributes (e.g., set:html, is:global, x-data)
        'react/no-unknown-property': 'off',
        'react/no-unescaped-entities': 'off',
        'react/jsx-key': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        // Relax some rules for JS->TS gradual migration
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    // Keep rules conservative; the custom check script enforces no TS annotations in .js
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn', // Downgrade to warnings
    'react/no-unescaped-entities': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'public/', '.astro/', 'egac_1/.astro/'],
};
