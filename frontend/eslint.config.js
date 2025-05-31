// frontend/eslint.config.js

import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/android/',
      '**/ios/',
    ],
  },


  js.configs.recommended,
  {
    files: [
      '**/metro.config.js',
      '**/babel.config.js',
      '**/jest.config.js',
      '**/react-native.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs', 
      parser: undefined,
      parserOptions: {
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off', // Allow Node.js globals to be used without being declared
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      '@typescript-eslint': typescript,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // Uncomment `project` if your test files themselves require type-aware linting
        // and are included in your tsconfig.json's `include` paths.
        // project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // makes tests easier
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: [
      '**/*.{ts,tsx,js,jsx}',
      '**/jest.config.ts',
    ],

    plugins: {
      '@typescript-eslint': typescript,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.browser, 
        ...globals.es2021, 
        __DEV__: 'readonly', 
        React: 'readonly',
      },
    },
    rules: {
      // TS rules
      ...typescript.configs['eslint-recommended'].rules,
      ...typescript.configs.recommended.rules,
      ...typescript.configs['recommended-type-checked'].rules, 
      ...typescript.configs['stylistic-type-checked'].rules, 

      // React rules
      'react/jsx-uses-react': 'off', // For React 17+ JSX transform
      'react/react-in-jsx-scope': 'off', // For React 17+ JSX transform
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native rules
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',

      // General rules
      'no-console': ['warn'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];