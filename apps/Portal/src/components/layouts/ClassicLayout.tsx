import { Outlet } from 'react-router-dom'
import ClassicTabNav from '../nav/ClassicTabNav'

export default function ClassicLayout() {
  return (
    <div data-layout-theme="classic" className="flex min-h-screen bg-[#111827]">
      <ClassicTabNav />
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
