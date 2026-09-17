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
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'SF Mono', 'Menlo', 'monospace']
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px'
      },
      colors: {
        canvas: {
          light: '#f5f2ed',
          dark: '#151412'
        },
        surface: {
          light: '#eceae4',
          dark: '#1c1b18'
        },
        code: {
          light: '#e2ded7',
          dark: '#252420'
        },
        accent: {
          DEFAULT: '#1a6b5a',
          hover: '#145447',
          dark: '#2ca88d',
          'dark-hover': '#248f78'
        },
        ink: {
          light: '#1a1a1a',
          dark: '#e8e4dc'
        },
        muted: {
          light: '#6b6560',
          dark: '#8c857b'
        }
      }
    }
  }
}
