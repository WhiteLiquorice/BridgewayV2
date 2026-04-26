import { useState, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import ExecutiveTopNav from '../nav/ExecutiveTopNav'
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

export default function ExecutiveLayout() {
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
    <div data-layout-theme="executive" className="min-h-screen bg-[#0f1724]">
      <ExecutiveTopNav
        onOpenSearch={() => setCmdOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Sub-header with page title */}
      <div className="border-b border-gray-800/40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
        </div>
      </div>

      {/* Page content */}
      <main key={fadeKey} className="max-w-7xl mx-auto px-6 py-6 animate-fade-in">
        <Outlet context={{ openNewAppointment: () => setNewApptOpen(true), openNewClient: () => setNewClientOpen(true) }} />
      </main>

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
