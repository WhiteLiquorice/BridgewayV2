import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { nav, LogOutIcon } from './navItems'

export default function ExecutiveTopNav() {
  const { org, profile, user, role, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    try { await signOut() } catch {}
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-[#0a1628] border-b border-gray-700/60">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded bg-brand/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">{org?.name || 'Admin'}</span>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-1">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand/15 text-brand'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right: user */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:inline">{user?.email}</span>
          <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center">
            <span className="text-brand text-[10px] font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
