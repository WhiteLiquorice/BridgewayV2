import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Guards portal routes — only 'patient' role gets through.
// Staff, admin, and manager are redirected to login with a hint.
export default function PatientRoute() {
  const { session, profile, role, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!session) return <Navigate to="/login" replace />

  // Profile loads async after session — wait for it before role-checking.
  // Without this guard, role=null briefly and every patient gets wrongly
  // redirected to /login?wrong-app=1 on every navigation / tab switch.
  if (profile === null) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Non-patient staff should use the Dashboard app, not the Portal
  if (role !== 'patient') return <Navigate to="/login?wrong-app=1" replace />

  return <Outlet />
}
