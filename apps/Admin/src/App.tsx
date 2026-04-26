import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LayoutThemeProvider } from './context/LayoutThemeContext'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import OrgSetup from './pages/OrgSetup'
import UserManagement from './pages/UserManagement'
import Billing from './pages/Billing'
import ServiceCatalog from './pages/ServiceCatalog'
import NotificationSettings from './pages/NotificationSettings'
import ActivityLog from './pages/ActivityLog'
import Memberships from './pages/Memberships'
import Forms from './pages/Forms'
import Onboarding from './pages/Onboarding'
import Commissions from './pages/Commissions'
import Marketing from './pages/Marketing'
import Inventory from './pages/Inventory'
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

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
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="/home"             element={<Home />} />
              <Route path="/org-setup"        element={<OrgSetup />} />
              <Route path="/users"            element={<UserManagement />} />
              <Route path="/billing"          element={<Billing />} />
              <Route path="/services"         element={<ServiceCatalog />} />
              <Route path="/memberships"       element={<Memberships />} />
              <Route path="/notifications"    element={<NotificationSettings />} />
              <Route path="/activity"         element={<ActivityLog />} />
              <Route path="/forms"            element={<Forms />} />
              <Route path="/commissions"      element={<Commissions />} />
              <Route path="/marketing"        element={<Marketing />} />
              <Route path="/inventory"        element={<Inventory />} />
              <Route path="/analytics"        element={<Analytics />} />
            </Route>
          </Route>

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </LayoutThemeProvider>
    </ThemeProvider>
  )
}
