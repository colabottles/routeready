export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => {
    // Check if we're on client side
    if (import.meta.client) {
      // Check localStorage first
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    return 'light'
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    if (import.meta.client) {
      localStorage.setItem('theme', theme.value)
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    if (import.meta.client) {
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  // Apply theme on mount
  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: computed(() => theme.value === 'dark')
  }
}