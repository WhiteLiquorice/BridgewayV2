import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { nav, LogOutIcon } from './navItems'

export default function MinimalSidebar({ onOpenShortcuts }) {
  const { org, signOut } = useAuth()
  const { primaryColor } = useTheme()
  const [hoveredItem, setHoveredItem] = useState(null)

  async function handleLogout() {
    try {
      await signOut()
    } catch {
      // Sign-out failure is non-fatal
    }
  }

  return (
    <aside className="w-[72px] flex-shrink-0 flex flex-col items-center border-r border-gray-800/50 min-h-screen sticky top-0" style={{ backgroundColor: 'var(--bw-sidebar)' }}>
      {/* Logo */}
      <div className="py-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: primaryColor }}
        >
          {org?.logo_url ? (
            <img src={org.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
          ) : (
            <svg className="w-4.5 h-4.5" style={{ color: '#080f1d' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 w-full px-3">
        {nav.map(({ to, label, icon }) => (
          <div key={to} className="relative">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center w-full h-10 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'text-brand'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: `${primaryColor}1a` } : {}}
              onMouseEnter={() => setHoveredItem(to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {icon}
            </NavLink>
            {/* Tooltip */}
            {hoveredItem === to && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-xs text-white whitespace-nowrap shadow-lg pointer-events-none">
                {label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom — shortcuts hint + logout */}
      <div className="py-4 space-y-2 w-full px-3">
        <button
          onClick={onOpenShortcuts}
          className="flex items-center justify-center w-full h-10 text-gray-600 hover:text-gray-400 transition-colors"
          title="Keyboard shortcuts (?)"
        >
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-800 rounded border border-gray-700">?</kbd>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full h-10 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          title="Sign out"
        >
          <LogOutIcon />
        </button>
      </div>
    </aside>
  )
}
