import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default ts.config(
  // Global ignores
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'node_modules/**',
      '.data/**',
      '.wrangler/**',
      '**/*.d.ts'
    ]
  },

  // Base JS
  js.configs.recommended,

  // TypeScript recommended configs
  ...ts.configs.recommended,

  // Vue configs
  ...vue.configs['flat/recommended'],

  // Custom project rules (Strict: No Any)
  {
    files: ['**/*.{js,ts,vue,mjs}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt & Vue auto-imports
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useState: 'readonly',
        useAsyncData: 'readonly',
        queryCollection: 'readonly',
        useSeoMeta: 'readonly',
        useHead: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        definePageMeta: 'readonly',
        withDefaults: 'readonly',
        defineNuxtConfig: 'readonly',
        defineCollection: 'readonly',
        defineContentConfig: 'readonly',
        defineEventHandler: 'readonly',
        setResponseHeader: 'readonly',
        createError: 'readonly',
        useTheme: 'readonly',
        useSearch: 'readonly'
      }
    },
    rules: {
      // Strict: No Any
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',

      // General code hygiene
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error'
    }
  }
)
