import { type ReactNode } from 'react'
import { useMobileSidebar } from '../../context/MobileSidebarContext'

interface Props {
  children: ReactNode
}

/**
 * Wraps any sidebar component to make it responsive:
 * - Desktop (lg+): renders the sidebar normally (static, always visible)
 * - Mobile (<lg): hides the sidebar, shows it as a slide-in drawer with backdrop when opened
 */
export default function MobileSidebarWrapper({ children }: Props) {
  const { isOpen, close } = useMobileSidebar()

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden lg:flex flex-shrink-0">
        {children}
      </div>

      {/* Mobile — slide-in drawer */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-white/[0.07] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close navigation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </>
  )
}
