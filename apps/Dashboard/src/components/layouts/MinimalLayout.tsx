import { useState, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import MinimalSidebar from '../nav/MinimalSidebar'
import CommandPalette from '../CommandPalette'
import ShortcutsModal from '../ShortcutsModal'
import AddAppointmentModal from '../AddAppointmentModal'
import AddClientModal from '../AddClientModal'
import OnboardingWizard from '../OnboardingWizard'
import { useAuth } from '../../context/AuthContext'

export default function MinimalLayout() {
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

  return (
    <div data-layout-theme="minimal" className="flex min-h-screen bg-[#0e1825]">
      <MinimalSidebar onOpenShortcuts={() => setShortcutsOpen(true)} />

      {/* Page content — no top header, generous padding */}
      <main key={fadeKey} className="flex-1 min-w-0 px-10 py-8 animate-fade-in">
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
