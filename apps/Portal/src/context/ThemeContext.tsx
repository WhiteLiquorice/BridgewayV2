import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { org } = useAuth()

  // Dark mode — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('portal-dark-mode')
    return stored === 'true'
  })

  // Apply brand color CSS variables whenever org primary_color changes
  useEffect(() => {
    const color = org?.primary_color || '#f59e0b'
    document.documentElement.style.setProperty('--bw-accent', color)
    document.documentElement.style.setProperty('--bw-primary', color)
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    document.documentElement.style.setProperty('--bw-accent-rgb', `${r}, ${g}, ${b}`)
    document.documentElement.style.setProperty('--bw-primary-rgb', `${r}, ${g}, ${b}`)
  }, [org?.primary_color])

  // Toggle `dark` class on <html> for Tailwind's class strategy
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  function toggleDarkMode() {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('portal-dark-mode', String(next))
  }

  return (
    <ThemeContext.Provider value={{
      primaryColor: org?.primary_color || '#f59e0b',
      darkMode,
      toggleDarkMode,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
