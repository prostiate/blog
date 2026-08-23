export const useTheme = () => {
  const isDark = useState<boolean>('site-theme-dark', () => false)

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('site-theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('site-theme', isDark.value ? 'dark' : 'light')
      applyTheme()
    }
  }

  const applyTheme = () => {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
