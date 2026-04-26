import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LayoutThemeProvider } from './context/LayoutThemeContext'
import { TerminologyProvider } from './context/TerminologyContext'
import { GuestOrgProvider } from './context/GuestOrgContext'
import PatientRoute from './components/PatientRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import ClientDashboard    from './pages/client/Dashboard'
import ClientAppointments from './pages/client/Appointments'
import ClientDocuments    from './pages/client/Documents'
import ClientProfile      from './pages/client/Profile'
import BookAppointment    from './pages/client/BookAppointment'
import IntakeForms        from './pages/client/IntakeForms'
import GuestBook          from './pages/guest/GuestBook'

// Redirect root: patients go to portal, staff/admin get a clear message
function RoleRedirect() {
  const { session, role, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  if (role === 'patient') return <Navigate to="/portal/dashboard" replace />
  // Staff, admin, manager — this app is patient-facing only
  return <Navigate to="/login?wrong-app=1" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <LayoutThemeProvider>
        <TerminologyProvider>
          <Routes>
            {/* Public guest booking — no auth required */}
            <Route path="/book" element={
              <GuestOrgProvider>
                <GuestBook />
              </GuestOrgProvider>
            } />

            <Route path="/login" element={<Login />} />
            <Route index element={<RoleRedirect />} />

            <Route element={<PatientRoute />}>
              <Route element={<Layout />}>
                <Route path="/portal/dashboard"    element={<ClientDashboard />} />
                <Route path="/portal/book"         element={<BookAppointment />} />
                <Route path="/portal/appointments" element={<ClientAppointments />} />
                <Route path="/portal/documents"    element={<ClientDocuments />} />
                <Route path="/portal/profile"      element={<ClientProfile />} />
                <Route path="/portal/forms"        element={<IntakeForms />} />
              </Route>
            </Route>

            <Route path="*" element={<RoleRedirect />} />
          </Routes>
        </TerminologyProvider>
        </LayoutThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
