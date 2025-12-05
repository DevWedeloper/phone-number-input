import angularEslintPlugin from '@angular-eslint/eslint-plugin'
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template'
import angularEslintTemplateParser from '@angular-eslint/template-parser'
import antfu from '@antfu/eslint-config'
import tsParser from '@typescript-eslint/parser'

export default antfu({
  formatters: true,
  pnpm: false,
}, {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
  },
  plugins: {
    '@angular-eslint': angularEslintPlugin,
  },
  processor: angularEslintTemplatePlugin.processors['extract-inline-html'],
  rules: {
    ...angularEslintPlugin.configs.recommended.rules,
  },
}, {
  files: ['**/*.html'],
  languageOptions: {
    parser: angularEslintTemplateParser,
  },
  plugins: {
    '@angular-eslint/template': angularEslintTemplatePlugin,
  },
  rules: {
    ...angularEslintTemplatePlugin.configs.recommended.rules,
    ...angularEslintTemplatePlugin.configs.accessibility.rules,
    'style/no-trailing-spaces': 'off',
    'style/indent': 'off',
    'style/no-multiple-empty-lines': 'off',
    'style/eol-last': 'off',
    'node/no-deprecated-api': 'off',
    'node/no-path-concat': 'off',
  },
}, {
  ignores: ['.angular/**'],
})
