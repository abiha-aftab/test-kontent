const js = require('@eslint/js')
const globals = require('globals')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')

const nodeFiles = [
  'eslint.config.js',
  'jest.config.js',
  'gatsby-config.js',
  'gatsby-node.js',
  'config/**/*.js',
  'plugins/**/*.js',
  'scripts/**/*.js',
  'src/utils/paths.js',
  'test/*-mock.js',
  'test/jest-preprocess.js',
]

module.exports = [
  {
    ignores: [
      'public/',
      '.cache/',
      'node_modules/',
      'coverage/',
      'src/assets/fonts/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, __PATH_PREFIX__: 'readonly' },
    },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
    },
  },
  {
    files: [...nodeFiles, 'gatsby-ssr.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  {
    files: ['test/**/*.{js,jsx}', '__mocks__/**/*.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
]
