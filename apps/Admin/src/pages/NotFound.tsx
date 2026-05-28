import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e]">
      <div className="max-w-md w-full mx-4 text-center">
        {/* 404 badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/[0.05] border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-400">Page not found</span>
        </div>

        {/* Big 404 */}
        <h1 className="text-7xl font-bold text-white/10 mb-2 select-none">404</h1>
        <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-sm text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-lg border border-white/[0.10] text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors"
          >
            Go back
          </button>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--bw-accent, #f59e0b)' }}
          >
            Admin Home
          </button>
        </div>
      </div>
    </div>
  )
}
