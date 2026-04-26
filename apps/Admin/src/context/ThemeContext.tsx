import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

const THEME_KEY    = 'bw_admin_theme'
const ACCENT_KEY   = 'bw_accent_color'
const VALID_THEMES = ['dark', 'midnight', 'slate']

export function ThemeProvider({ children }) {
  const { org } = useAuth()

  // Restore theme from localStorage on mount (default: 'dark')
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY)
    return VALID_THEMES.includes(stored) ? stored : 'dark'
  })

  // Restore accent color from localStorage (default: #f59e0b)
  const [accentColor, setAccentState] = useState(() => {
    return localStorage.getItem(ACCENT_KEY) || '#f59e0b'
  })

  // Apply --bw-primary CSS variable from org settings
  useEffect(() => {
    const color = org?.primary_color || '#f59e0b'
    document.documentElement.style.setProperty('--bw-primary', color)
    // RGB triplet for opacity variants like rgba(var(--bw-primary-rgb), 0.1)
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    document.documentElement.style.setProperty('--bw-primary-rgb', `${r}, ${g}, ${b}`)
  }, [org?.primary_color])

  // Apply --bw-accent + --bw-accent-rgb CSS variables whenever accentColor changes.
  // The Admin app sources the accent from the org's primary_color (set in Org Setup),
  // so Admin inherits the same brand color as Dashboard. Falls back to localStorage/default.
  useEffect(() => {
    const effective = org?.primary_color || accentColor
    document.documentElement.style.setProperty('--bw-accent', effective)
    const hex = effective.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    document.documentElement.style.setProperty('--bw-accent-rgb', `${r}, ${g}, ${b}`)
  }, [accentColor, org?.primary_color])

  // Apply data-theme attribute whenever theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  function setTheme(newTheme) {
    if (!VALID_THEMES.includes(newTheme)) return
    localStorage.setItem(THEME_KEY, newTheme)
    setThemeState(newTheme)
  }

  function setAccentColor(color) {
    // Validate it's a 6-digit hex color before saving
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return
    localStorage.setItem(ACCENT_KEY, color)
    setAccentState(color)
  }

  return (
    <ThemeContext.Provider value={{
      primaryColor: org?.primary_color || '#f59e0b',
      theme,
      setTheme,
      accentColor,
      setAccentColor,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
