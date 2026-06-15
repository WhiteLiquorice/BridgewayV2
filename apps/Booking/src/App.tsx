import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Book from './pages/Book'
import Login from './pages/Login'
import ClientDashboard from './pages/ClientDashboard'
import OrgFrontDesk from './pages/OrgFrontDesk'

function RoleRedirect() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    // If not logged in, go to the default public booking slug
    return <Navigate to="/wellness-co" replace />
  }

  if (role === 'patient') {
    return <Navigate to="/portal/dashboard" replace />
  }

  if (role === 'staff' || role === 'manager' || role === 'admin') {
    return <Navigate to="/org/frontdesk" replace />
  }

  // Fallback
  return <Navigate to="/login?wrong-app=1" replace />
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    return <Navigate to="/login?wrong-app=1" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Client Dashboard (Patient portal view) */}
          <Route
            path="/portal/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Org Booking Front Desk (Staff view) */}
          <Route
            path="/org/frontdesk"
            element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                <OrgFrontDesk />
              </ProtectedRoute>
            }
          />

          {/* Public guest booking route, e.g. bridgewaybooking.com/wellness-co */}
          <Route path="/:slug" element={<Book />} />

          {/* Root redirect handles routing based on auth and roles */}
          <Route index element={<RoleRedirect />} />
          
          {/* Catch-all redirects back to root handler */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
