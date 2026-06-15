import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutThemeProvider, ThemeProvider } from '@bridgeway/ui'
import { getBookingPageData } from '@bridgeway/database'
import { dataconnect } from './lib/firebase'
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

export default function App() {
  const [org, setOrg]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function loadOrg() {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const orgSlug = searchParams.get('org') || 'bridgeway'
        
        const { data: orgData } = await getBookingPageData(dataconnect, { slug: orgSlug })
        const loadedOrg = orgData?.orgs?.[0]
        
        if (!loadedOrg) {
          setError('Organization not found.')
          setLoading(false)
          return
        }

        const orgObj = {
          id: loadedOrg.id,
          name: loadedOrg.name,
          slug: orgSlug,
          primary_color: loadedOrg.primaryColor || '#6366f1',
          layout_theme: loadedOrg.layoutTheme || 'modern',
          logo_url: loadedOrg.logoUrl
        }
        
        setOrg(orgObj)
        // Set the CSS variables to mimic the AuthContext/ThemeProvider setup
        // Note: we're manually applying this because AuthContext requires real Firebase login,
        // and Kiosk apps typically load via an anonymous or service token.
        document.documentElement.style.setProperty('--bw-accent', orgObj.primary_color)
        document.documentElement.setAttribute('data-theme', 'light') // Enforce light mode for Kiosk readability
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching organization:', err)
        setError(err.message || 'Failed to fetch organization settings.')
        setLoading(false)
      }
    }
    loadOrg()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-amber-500" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080f1d] text-white p-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Error Loading Kiosk</h1>
        <p className="text-lg text-gray-300">{error}</p>
      </div>
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
