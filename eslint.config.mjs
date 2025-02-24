import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      ecmaVersion: 11,
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'boundaries/no-unknown-files': false,
      'boundaries/no-unknown': false,
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      // Prefer readonly properties for inline lambdas
      '@typescript-eslint/prefer-readonly': [
        'error',
        { onlyInlineLambdas: true },
      ],

      // Allow unused variables if they start with an underscore
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Airbnb rules adjustments
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',

      // Prettier
      'prettier/prettier': 'error',
    },
  },
];
