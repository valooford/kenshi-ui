/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        // motivation: globally declared types
        // restrictions: .vue files mustn't be written in JS
        'no-undef': 0,
        'no-console': 1,
      },
    },
  ],
}
