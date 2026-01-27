import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Load from localStorage on init
const getStoredTheme = (): Theme => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') {
        return stored as Theme
      }
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
    }
  } catch (e) {
    console.error('Error loading theme from localStorage:', e)
  }
  return 'dark'
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    try {
      // Update state first
      set({ theme })
      
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', theme)
      }
      
      // Apply theme to document
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
      }
    } catch (e) {
      console.error('Error saving theme to localStorage:', e)
    }
  },
  toggleTheme: () => {
    const currentTheme = get().theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    get().setTheme(newTheme)
  },
}))

// Initialize theme on load
if (typeof window !== 'undefined') {
  const initTheme = () => {
    const theme = getStoredTheme()
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }
  
  // Initialize immediately
  initTheme()
  
  // Also initialize on DOM ready if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme)
  }
}

