import antfu from '@antfu/eslint-config'
import tsParser from '@typescript-eslint/parser'
import eslintParserAstro from 'astro-eslint-parser'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu({
  formatters: true,
  astro: true,
}, {
  files: ['**/*.ts', '**/*.tsx', '**/*.jsx'],
  languageOptions: {
    parser: tsParser,
  },
}, {
  files: ['**/*.astro'],
  languageOptions: {
    parser: eslintParserAstro,
  },
  rules: {
    'style/multiline-ternary': 'off',
  },
}, {
  plugins: {
    'better-tailwindcss': eslintPluginBetterTailwindcss,
  },
  rules: {
    ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
    ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    'better-tailwindcss/no-unregistered-classes': 'off',
  },
})
