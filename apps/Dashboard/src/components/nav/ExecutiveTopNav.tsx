import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { nav, LogOutIcon } from './navItems'

export default function ExecutiveTopNav({ onOpenSearch, onOpenShortcuts }) {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Sign-out failure is non-fatal
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0a1628] border-b border-gray-700/60">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left — Logo / org name */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
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

        {/* Center — Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: `${primaryColor}33` } : {}}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right — Search, shortcuts, user, logout */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 text-sm text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-800 rounded border border-gray-700">
              {'\u2318'}K
            </kbd>
          </button>

          {/* Shortcuts hint */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
            title="Keyboard shortcuts"
          >
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-800 rounded border border-gray-700">?</kbd>
          </button>

          {/* User avatar */}
          {profile && (
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-400">
                {(profile.full_name || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
