import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { navItems, LogOutIcon } from './navItems'

export default function ClassicTabNav() {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    try { await supabase.auth.signOut() } catch { /* onAuthStateChange fires SIGNED_OUT locally regardless */ }
    navigate('/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-[#0d1520] border-r border-gray-800/60 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800/60">
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

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors border-l-[3px] ${
                isActive
                  ? 'text-amber-400 bg-white/[0.04]'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/[0.03]'
              }`
            }
            style={({ isActive }) => isActive ? { borderLeftColor: primaryColor } : {}}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-gray-800/60">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${primaryColor}33` }}
          >
            <span className="text-xs font-semibold" style={{ color: primaryColor }}>
              {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{profile?.full_name || 'Loading...'}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}
