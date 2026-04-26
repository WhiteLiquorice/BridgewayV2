import { supabase } from '../lib/supabase'

/**
 * Paywall — shown to patients when org.status === 'inactive'.
 * Patients cannot fix billing themselves; we direct them to support.
 */
export default function Paywall() {
  function handleSignOut() {
    supabase.auth.signOut()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-amber-600/20 border border-amber-500/30">
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
        <p className="text-gray-400 mb-4 leading-relaxed">
          Access to this portal has been temporarily suspended.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          If you need to access your records or upcoming appointments, please contact
          your provider directly.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact Support
          </a>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
