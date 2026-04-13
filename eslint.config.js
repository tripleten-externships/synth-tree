import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'pnpm-lock.yaml',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Airbnb-style base rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off',
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'prefer-destructuring': 'warn',
      'prefer-arrow-callback': 'warn',
      'object-shorthand': 'warn',
      'no-nested-ternary': 'warn',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import rules
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
    },
  },
];
