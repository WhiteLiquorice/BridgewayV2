import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
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
import Campaigns from './pages/Campaigns'
import CapacityPlanning from './pages/CapacityPlanning'
import ClientSegments from './pages/ClientSegments'
import ClientValue from './pages/ClientValue'
import Expenses from './pages/Expenses'
import FeedbackAnalytics from './pages/FeedbackAnalytics'
import GiftCards from './pages/GiftCards'
import Integrations from './pages/Integrations'
import RecurringRevenue from './pages/RecurringRevenue'
import Reports from './pages/Reports'
import ServiceAnalytics from './pages/ServiceAnalytics'
import StaffPerformance from './pages/StaffPerformance'
import StaffScheduling from './pages/StaffScheduling'


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
              <Route path="/campaigns"        element={<Campaigns />} />
              <Route path="/capacity"         element={<CapacityPlanning />} />
              <Route path="/segments"         element={<ClientSegments />} />
              <Route path="/client-value"     element={<ClientValue />} />
              <Route path="/expenses"         element={<Expenses />} />
              <Route path="/feedback"         element={<FeedbackAnalytics />} />
              <Route path="/gift-cards"       element={<GiftCards />} />
              <Route path="/integrations"     element={<Integrations />} />
              <Route path="/recurring-revenue" element={<RecurringRevenue />} />
              <Route path="/reports"          element={<Reports />} />
              <Route path="/service-analytics" element={<ServiceAnalytics />} />
              <Route path="/staff-performance" element={<StaffPerformance />} />
              <Route path="/staff-scheduling"  element={<StaffScheduling />} />
            </Route>
          </Route>

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
        <Link to="/home" className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors inline-block">Go to Admin</Link>
      </div>
    </div>
  )
}
