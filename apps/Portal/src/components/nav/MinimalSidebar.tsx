import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { navItems, LogOutIcon } from './navItems'

export default function MinimalSidebar() {
  const { profile, user, org } = useAuth()
  const { primaryColor } = useTheme()
  const navigate = useNavigate()
  const [hoveredItem, setHoveredItem] = useState(null)

  async function handleSignOut() {
    try { await supabase.auth.signOut() } catch { /* onAuthStateChange fires SIGNED_OUT locally regardless */ }
    navigate('/login')
  }

  return (
    <aside className="w-[72px] flex-shrink-0 flex flex-col items-center bg-[#080f1d] border-r border-gray-800/60 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center justify-center py-5 border-b border-gray-800/60 w-full">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${primaryColor}33` }}
        >
          {org?.logo_url ? (
            <img src={org.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
          ) : (
            <svg
              className="w-5 h-5"
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
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center py-4 gap-1 w-full">
        {navItems.map(({ to, label, icon: Icon }) => (
          <div key={to} className="relative">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: `${primaryColor}1a` } : {}}
              onMouseEnter={() => setHoveredItem(to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon />
            </NavLink>
            {/* Tooltip */}
            {hoveredItem === to && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg border border-gray-700/60 z-50 pointer-events-none">
                {label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="py-4 border-t border-gray-800/60 w-full flex flex-col items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${primaryColor}33` }}
        >
          <span className="text-xs font-semibold" style={{ color: primaryColor }}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onMouseEnter={() => setHoveredItem('signout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LogOutIcon />
          </button>
          {hoveredItem === 'signout' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg border border-gray-700/60 z-50 pointer-events-none">
              Sign out
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
