import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: ['node_modules/', 'dist/', 'ui/', 'supabase/', '**/*.config.js'],
  },
]
