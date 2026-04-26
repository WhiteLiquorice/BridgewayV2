import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { nav, LogOutIcon } from './navItems'

export default function ClassicTabNav({ onOpenShortcuts }) {
  const { profile, user, org, signOut } = useAuth()
  const { primaryColor } = useTheme()

  async function handleLogout() {
    try {
      await signOut()
    } catch {
      // Sign-out failure is non-fatal
    }
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-gray-800/50 min-h-screen sticky top-0 bg-[#0d1520]">
      {/* Logo / business name */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            {org?.logo_url ? (
              <img src={org.logo_url} alt="" className="w-full h-full rounded object-cover" />
            ) : (
              <svg className="w-3.5 h-3.5" style={{ color: '#080f1d' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            )}
          </div>
          <span className="text-white font-semibold text-xs tracking-tight truncate">
            {org?.name || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3">
        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors duration-150 border-l-2 ${
                isActive
                  ? 'text-white border-current bg-white/5'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/[0.03]'
              }`
            }
            style={({ isActive }) => isActive ? { borderColor: primaryColor, color: primaryColor } : {}}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / logout */}
      <div className="px-3 py-3 border-t border-gray-800/50 space-y-1">
        {/* Shortcuts hint */}
        <button
          onClick={onOpenShortcuts}
          className="w-full flex items-center gap-2 px-3 py-1 text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          <span>Press</span>
          <kbd className="px-1 py-0.5 text-[9px] font-medium bg-gray-800 rounded border border-gray-700">?</kbd>
          <span>for shortcuts</span>
        </button>
        <div className="px-3 py-1">
          <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  )
}
