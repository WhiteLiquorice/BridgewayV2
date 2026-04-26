import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { navItems, LogOutIcon } from './navItems'

export default function ExecutiveTopNav() {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    try { await supabase.auth.signOut() } catch { /* onAuthStateChange fires SIGNED_OUT locally regardless */ }
    navigate('/login')
  }

  return (
    <header className="w-full bg-[#0a1628] border-b border-gray-700/60 sticky top-0 z-30">
      <div className="flex items-center h-14 px-6">
        {/* Logo / org name — left */}
        <div className="flex items-center gap-3 mr-8 flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${primaryColor}33` }}
          >
            {org?.logo_url ? (
              <img src={org.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <svg
                className="w-4 h-4"
                style={{ color: primaryColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            {org?.name || 'Patient Portal'}
          </span>
        </div>

        {/* Nav links — center */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: `${primaryColor}1a` } : {}}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User — right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${primaryColor}33` }}
            >
              <span className="text-xs font-semibold" style={{ color: primaryColor }}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <span className="text-white text-xs font-medium hidden lg:inline">
              {profile?.full_name || 'Loading...'}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOutIcon />
            <span className="hidden lg:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
