import { Outlet } from 'react-router-dom'
import MinimalSidebar from '../nav/MinimalSidebar'

export default function MinimalLayout() {
  return (
    <div data-layout-theme="minimal" className="flex min-h-screen bg-[#0e1825]">
      <MinimalSidebar />
      <main className="flex-1 min-w-0 overflow-auto px-10 py-8">
        <Outlet />
      </main>
    </div>
  )
}
