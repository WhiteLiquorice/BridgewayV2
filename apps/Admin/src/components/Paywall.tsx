import { useAuth } from '../context/AuthContext'

/**
 * Paywall — shown when org.status === 'inactive' (subscription lapsed or payment failed).
 * Admin app users are always admin/manager, so we always show the Billing link.
 */
export default function Paywall() {
  const { profile, signOut } = useAuth()

  function handleSignOut() {
    signOut().catch(() => { /* non-fatal */ })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c1a2e] px-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-600/20 border border-indigo-500/30">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Subscription Inactive</h1>
        <p className="text-gray-400 mb-2 leading-relaxed">
          Your organization&apos;s subscription has lapsed or a payment has failed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Update your billing details to restore full access to all apps.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/billing"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            Go to Billing
          </a>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        {profile?.role === 'manager' && (
          <p className="mt-6 text-xs text-gray-600">
            Contact your admin to resolve the billing issue.
          </p>
        )}
      </div>
    </div>
  )
}
