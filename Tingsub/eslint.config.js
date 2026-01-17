import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier/flat';

export default [
  // 忽略文件和目录
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'build/**'],
  },
  // 基础JavaScript推荐规则
  js.configs.recommended,
  // React推荐规则
  react.configs.flat.recommended,
  // React Hooks推荐规则
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      prettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Prettier规则
      'prettier/prettier': 'error',
      // TypeScript推荐规则
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // React规则
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // 'react/jsx-uses-react': 'off',
      // 'react/jsx-uses-vars': 'off',
      // React Native规则
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'error',
      'react-native/sort-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-raw-text': 'off',
      'react-native/no-single-element-style-arrays': 'error',
      // React Hooks规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // 通用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Prettier配置（禁用与Prettier冲突的规则）
      ...prettierConfig.rules,
    },
  },
];
