import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutThemeProvider, ThemeProvider } from '@bridgeway/ui'
import Home      from './pages/Home'
import WalkIn    from './pages/WalkIn'
import CheckIn   from './pages/CheckIn'
import Schedule  from './pages/Schedule'
import Done      from './pages/Done'

const INACTIVITY_MS = 40000 // 40 s

// ── Org context ────────────────────────────────────────────────────────────────
export const OrgContext = createContext<any>(null)
export function useOrg() { return useContext(OrgContext) }

// ── Inactivity context ─────────────────────────────────────────────────────────
export const InactivityContext = createContext(() => {})
export function useResetInactivity() { return useContext(InactivityContext) }

function KioskShell() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const timerRef  = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // Don't redirect if already home
      if (location.pathname !== '/') navigate('/', { replace: true })
    }, INACTIVITY_MS)
  }, [navigate, location.pathname])

  // Re-arm on every navigation or pointer event
  useEffect(() => { resetTimer() }, [location.pathname])
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <InactivityContext.Provider value={resetTimer}>
      <div
        className="min-h-screen bg-[var(--bw-bg)] text-[var(--lt-text-primary)] transition-colors duration-300"
        onPointerMove={resetTimer}
        onPointerDown={resetTimer}
      >
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/walkin"   element={<WalkIn />} />
          <Route path="/checkin"  element={<CheckIn />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/done"     element={<Done />} />
        </Routes>
      </div>
    </InactivityContext.Provider>
  )
}

// Temporary Mock Org Data to replace Supabase call
const MOCK_ORG = {
  id: '123',
  name: 'Bridgeway Wellness Center',
  slug: 'bridgeway',
  primary_color: '#f59e0b',
  layout_theme: 'modern'
}

export default function App() {
  const [org, setOrg]       = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching the org from Firebase Data Connect
    setTimeout(() => {
      setOrg(MOCK_ORG)
      // Set the CSS variables to mimic the AuthContext/ThemeProvider setup
      // Note: we're manually applying this because AuthContext requires real Firebase login,
      // and Kiosk apps typically load via an anonymous or service token.
      document.documentElement.style.setProperty('--bw-accent', MOCK_ORG.primary_color)
      document.documentElement.setAttribute('data-theme', 'light') // Enforce light mode for Kiosk readability
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-amber-500" />
    </div>
  )

  return (
    <OrgContext.Provider value={org}>
      {/* 
        We wrap in ThemeProvider & LayoutThemeProvider so our new shared components 
        automatically style themselves according to the Org's settings!
      */}
      <ThemeProvider>
        <LayoutThemeProvider>
          <BrowserRouter>
            <KioskShell />
          </BrowserRouter>
        </LayoutThemeProvider>
      </ThemeProvider>
    </OrgContext.Provider>
  )
}
