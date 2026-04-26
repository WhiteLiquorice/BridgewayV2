import { useState, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import ClassicTabNav from '../nav/ClassicTabNav'
import CommandPalette from '../CommandPalette'
import ShortcutsModal from '../ShortcutsModal'
import AddAppointmentModal from '../AddAppointmentModal'
import AddClientModal from '../AddClientModal'
import OnboardingWizard from '../OnboardingWizard'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/overview': 'Dashboard',
  '/appointments': 'Appointments',
  '/clients': 'Clients',
  '/classes': 'Classes',
  '/queue': 'Queue',
  '/revenue': 'Revenue',
  '/availability': 'Availability',
  '/staff': 'Staff Schedule',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function ClassicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, org } = useAuth()

  const [cmdOpen, setCmdOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [newApptOpen, setNewApptOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [fadeKey, setFadeKey] = useState(location.pathname)

  // Show onboarding wizard for new orgs that haven't completed setup
  useEffect(() => {
    if (org && org.onboardingComplete === false) {
      setShowOnboarding(true)
    }
  }, [org?.id])

  // Page-transition fade key
  useEffect(() => {
    setFadeKey(location.pathname)
  }, [location.pathname])

  // Global keyboard shortcuts
  const handleGlobalKey = useCallback((e) => {
    const tag = e.target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
    if (cmdOpen || shortcutsOpen || newApptOpen || newClientOpen) return

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCmdOpen(true)
      return
    }
    if (e.key === 'n' || e.key === 'N') { setNewApptOpen(true); return }
    if (e.key === 'c' || e.key === 'C') { navigate('/clients'); return }
    if (e.key === '?') { setShortcutsOpen(true); return }
  }, [cmdOpen, shortcutsOpen, newApptOpen, newClientOpen, navigate])

  const handleCtrlK = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCmdOpen(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey)
    window.addEventListener('keydown', handleCtrlK)
    return () => {
      window.removeEventListener('keydown', handleGlobalKey)
      window.removeEventListener('keydown', handleCtrlK)
    }
  }, [handleGlobalKey, handleCtrlK])

  // Derive page title
  const basePath = '/' + (location.pathname.split('/')[1] || 'overview')
  const pageTitle = PAGE_TITLES[basePath] || ''

  return (
    <div data-layout-theme="classic" className="flex min-h-screen bg-[#111827]">
      <ClassicTabNav onOpenShortcuts={() => setShortcutsOpen(true)} />

      <div className="flex-1 min-w-0 flex flex-col overflow-auto">
        {/* Compact header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-2.5 border-b border-gray-800/50 bg-[#111827]">
          <h1 className="text-sm font-semibold text-white">{pageTitle}</h1>

          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-700 text-xs text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="hidden sm:inline-flex items-center px-1 py-0.5 text-[9px] font-medium text-gray-600 bg-gray-800 rounded border border-gray-700">
                {'\u2318'}K
              </kbd>
            </button>

            {/* User avatar */}
            {profile && (
              <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-gray-400">
                  {(profile.fullName || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main key={fadeKey} className="flex-1 animate-fade-in">
          <Outlet context={{ openNewAppointment: () => setNewApptOpen(true), openNewClient: () => setNewClientOpen(true) }} />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNewAppointment={() => setNewApptOpen(true)}
        onNewClient={() => setNewClientOpen(true)}
      />

      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <AddAppointmentModal
        isOpen={newApptOpen}
        onClose={() => setNewApptOpen(false)}
        onCreated={() => {}}
      />

      <AddClientModal
        isOpen={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        onCreated={() => {}}
      />

      <OnboardingWizard
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  )
}
