// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Object shapes are interfaces. `type` stays only for unions/tuples, which interfaces cannot express.
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },
]);
