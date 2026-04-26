import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { nav, LogOutIcon } from './navItems'

export default function ModernSidebar({ onOpenShortcuts }) {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Sign-out failure is non-fatal — onAuthStateChange still fires SIGNED_OUT
      // locally, so the user is effectively logged out even on a network error.
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/[0.07] min-h-screen sticky top-0" style={{ backgroundColor: 'var(--bw-sidebar)' }}>
      {/* Logo / business name */}
      <div className="px-6 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            {org?.logo_url ? (
              <img src={org.logo_url} alt="" className="w-full h-full rounded-md object-cover" />
            ) : (
              <svg className="w-4 h-4" style={{ color: '#080f1d' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            )}
          </div>
          <span className="text-white font-semibold text-sm tracking-tight truncate">
            {org?.name || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-brand'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: `${primaryColor}1a` } : {}}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / logout */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
        {/* Shortcuts hint */}
        <button
          onClick={onOpenShortcuts}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white/[0.07] rounded border border-white/[0.12]">?</kbd>
          <span>for shortcuts</span>
        </button>
        <div className="px-3 py-1.5">
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}
