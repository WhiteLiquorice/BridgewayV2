import { Outlet } from 'react-router-dom'
import ExecutiveTopNav from '../nav/ExecutiveTopNav'

export default function ExecutiveLayout() {
  return (
    <div data-layout-theme="executive" className="min-h-screen bg-[#0f1724]">
      <ExecutiveTopNav />
      <main className="max-w-5xl mx-auto px-6 py-4">
        <Outlet />
      </main>
    </div>
  )
}
