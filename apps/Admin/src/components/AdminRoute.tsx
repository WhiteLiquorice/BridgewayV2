import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Paywall from './Paywall'

// Only admin and manager roles can access admin app pages
export default function AdminRoute() {
  const { session, profile, org, role, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!session) return <Navigate to="/login" replace />

  // Profile loads async after session — wait for it before role-checking.
  // Without this guard, role=null briefly and every admin/manager gets
  // wrongly redirected to /login on every navigation or tab switch.
  if (profile === null) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Role gate: only admin and manager may use the Admin app.
  // Staff or patient users who somehow reach this URL see an unauthorized screen.
  if (role !== 'admin' && role !== 'manager') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e] px-4">
        <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-red-600/20 border border-red-500/30">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Unauthorized</h1>
          <p className="text-gray-400 text-sm mb-6">
            You don&apos;t have permission to access the Admin panel.
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    )
  }

  // Subscription gate: show paywall when org is confirmed inactive.
  if (org?.status === 'inactive') return <Paywall />

  return <Outlet />
}
