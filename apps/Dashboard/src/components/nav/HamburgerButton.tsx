import { useMobileSidebar } from '../../context/MobileSidebarContext'

/**
 * Hamburger menu button — only visible on mobile (< lg breakpoint).
 * Place this in header bars to trigger the mobile sidebar.
 */
export default function HamburgerButton() {
  const { toggle } = useMobileSidebar()

  return (
    <button
      onClick={toggle}
      className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.07] transition-colors"
      aria-label="Toggle navigation menu"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  )
}
