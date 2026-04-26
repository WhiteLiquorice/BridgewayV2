/**
 * GoogleOAuthCallback.tsx
 *
 * Handles the redirect from Google after the user grants Calendar access.
 * Route: /admin/oauth/google
 *
 * Google appends ?code=XXX&state=orgId to this URL.
 * We call the handleGoogleOAuthCallback Cloud Function to exchange the code
 * for tokens and store them on the org document.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { handleGoogleOAuthCallback } from '../../lib/firebase'

export default function GoogleOAuthCallback() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code    = params.get('code')
    const orgId   = params.get('state')
    const error   = params.get('error')

    if (error) {
      setErrorMsg(error === 'access_denied' ? 'You declined the Google Calendar permission.' : `Google returned an error: ${error}`)
      setStatus('error')
      return
    }

    if (!code || !orgId) {
      setErrorMsg('Missing code or state parameter from Google. Please try connecting again.')
      setStatus('error')
      return
    }

    const redirectUri = `${window.location.origin}/admin/oauth/google`

    handleGoogleOAuthCallback({ orgId, code, redirectUri })
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/admin/settings'), 2000)
      })
      .catch((err) => {
        setErrorMsg(err.message || 'An unknown error occurred.')
        setStatus('error')
      })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#080f1d] flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-white font-semibold text-lg">Connecting Google Calendar…</p>
            <p className="text-gray-400 text-sm mt-2">Exchanging authorization code for access tokens.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">Calendar Connected!</p>
            <p className="text-gray-400 text-sm mt-2">Your Google Calendar is now synced. Redirecting you to Settings…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">Connection Failed</p>
            <p className="text-gray-400 text-sm mt-2">{errorMsg}</p>
            <button
              onClick={() => navigate('/admin/settings')}
              className="mt-5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#080f1d] font-semibold rounded-lg text-sm transition-colors"
            >
              Back to Settings
            </button>
          </>
        )}
      </div>
    </div>
  )
}
