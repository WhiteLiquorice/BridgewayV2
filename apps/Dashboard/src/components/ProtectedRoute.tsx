import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Paywall from './Paywall'

export default function ProtectedRoute() {
  const { session, org, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  // Org loads async after session — only show paywall once org is confirmed inactive.
  if (org?.status === 'inactive') {
    return <Paywall />
  }

  if (org?.subscriptionTier === 'booking-only') {
    const allowedPaths = ['/overview', '/appointments', '/availability', '/settings']
    const isAllowed = allowedPaths.some(p => window.location.pathname.startsWith(p))
    if (!isAllowed) {
      return <Paywall />
    }
  }

  return <Outlet />
}
