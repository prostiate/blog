import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './content/**/*.{md,yml,json}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'SF Mono', 'Menlo', 'monospace']
      },
      colors: {
        canvas: {
          light: '#FAF9F5',
          dark: '#121214'
        },
        surface: {
          light: '#F3F1EA',
          dark: '#19191D'
        }
      }
    }
  }
}
