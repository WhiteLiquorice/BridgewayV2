import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { navItems, LogOutIcon } from './navItems'

export default function ModernSidebar() {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    try { await supabase.auth.signOut() } catch { /* onAuthStateChange fires SIGNED_OUT regardless */ }
    navigate('/login')
  }

  const initial = profile?.full_name?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || '?'

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-neutral-100 min-h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-neutral-100">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${primaryColor}18` }}
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
        <span className="font-serif text-neutral-900 text-base tracking-wide leading-tight">
          {org?.name || 'Client Portal'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-neutral-900 bg-neutral-50'
                  : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Brand-color active indicator — thin left border only */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
                <span style={isActive ? { color: primaryColor } : {}}>
                  <Icon />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5 border-t border-neutral-100">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
            style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-neutral-800 text-xs font-medium truncate">{profile?.full_name || 'Loading…'}</p>
            <p className="text-neutral-400 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <LogOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}
