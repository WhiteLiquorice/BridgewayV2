import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Paywall from './Paywall'

export default function ProtectedRoute() {
  const { session, org, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!session) return <Navigate to="/login" replace />

  // Show patient-facing suspended message when org subscription is inactive.
  if (org?.status === 'inactive') return <Paywall />

  return <Outlet />
}
