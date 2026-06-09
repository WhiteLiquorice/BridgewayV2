import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LayoutThemeProvider } from './context/LayoutThemeContext'
import { ToastProvider } from './context/ToastContext'
import { TerminologyProvider } from './context/TerminologyContext'
import ProtectedRoute  from './components/ProtectedRoute'
import Layout          from './components/Layout'
import Login           from './pages/Login'
import Overview        from './pages/Overview'
import Appointments    from './pages/Appointments'
import Clients         from './pages/Clients'
import ClientDetail    from './pages/ClientDetail'
import Revenue         from './pages/Revenue'
import Settings        from './pages/Settings'
import Availability    from './pages/Availability'
import Classes         from './pages/Classes'
import Queue           from './pages/Queue'
import StaffSchedule   from './pages/StaffSchedule'
import Reports         from './pages/Reports'
import Checkout        from './pages/Checkout'
import Inventory       from './pages/Inventory'
import ClientImporter  from './pages/ClientImporter'

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LayoutThemeProvider>
      <ToastProvider>
      <TerminologyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="/overview"              element={<Overview />} />
              <Route path="/appointments"          element={<Appointments />} />
              <Route path="/clients"               element={<Clients />} />
              <Route path="/clients/:id"           element={<ClientDetail />} />
              <Route path="/clients/import"        element={<ClientImporter />} />
              <Route path="/inventory"             element={<Inventory />} />
              <Route path="/revenue"               element={<Revenue />} />
              <Route path="/availability"          element={<Availability />} />
              <Route path="/classes"               element={<Classes />} />
              <Route path="/queue"                 element={<Queue />} />
              <Route path="/staff"                 element={<StaffSchedule />} />
              <Route path="/reports"               element={<Reports />} />
              <Route path="/settings"              element={<Settings />} />
              <Route path="/checkout"              element={<Checkout />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TerminologyProvider>
      </ToastProvider>
      </LayoutThemeProvider>
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="text-center max-w-md px-6">
        <p className="text-6xl font-serif text-white/20 mb-4">404</p>
        <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-sm text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/overview" className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors inline-block">Go to Dashboard</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
