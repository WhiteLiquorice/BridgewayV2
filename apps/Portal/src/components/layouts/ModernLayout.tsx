import { Outlet } from 'react-router-dom'
import ModernSidebar from '../nav/ModernSidebar'

export default function ModernLayout() {
  return (
    <div data-layout-theme="modern" className="flex min-h-screen bg-stone-50">
      <ModernSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
