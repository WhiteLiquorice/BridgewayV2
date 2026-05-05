import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'

// TODO: Replace with Firebase DataConnect query if branding is needed before auth.
async function fetchOrgBranding() {
  return null;
}

export default function Login() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const wrongApp = searchParams.get('wrong-app') === '1'

  // Org branding loaded before auth
  const [branding, setBranding] = useState(null)
  useEffect(() => {
    fetchOrgBranding().then(data => { if (data) setBranding(data) })
  }, [])

  const primaryColor = branding?.primary_color || '#1b2333'
  const orgName      = branding?.name || 'Client Portal'

  // 'login' | 'signup' | 'forgot'
  const [view, setView] = useState('login')
  const [resetSent, setResetSent] = useState(false)

  // Signup-specific state
  const [signupName, setSignupName]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [signupDone, setSignupDone]          = useState(false)

  // Already authenticated → bounce to root (RoleRedirect handles it)
  useEffect(() => {
    if (session) navigate('/', { replace: true })
  }, [session])

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.')
      } else {
        setError('Unable to sign in — check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      // Note: Full signup flow (provisioning profile) should be handled via Firebase Functions or DataConnect
      await createUserWithEmailAndPassword(auth, email, password)
      setSignupDone(true)
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Unable to create account — check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/portal/profile`
      })
      setResetSent(true)
    } catch (err: any) {
      console.error('Reset error:', err)
      setError(err.message || 'Unable to send reset link — check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Shared input/button styles — dark on white card
  const inputCls = "w-full bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 transition-colors"

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Subtle dark overlay so very light brand colors still give depth */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative w-full max-w-sm z-10">

        {/* Wrong app notice */}
        {wrongApp && (
          <div className="mb-6 bg-white/90 rounded-2xl px-5 py-4 text-center shadow-lg">
            <p className="text-neutral-800 text-sm font-medium">Staff access is via the Dashboard app</p>
            <p className="text-neutral-500 text-xs mt-0.5">This portal is for clients only.</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">

          {/* Brand header strip */}
          <div className="px-8 pt-8 pb-6 text-center">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt={orgName} className="h-10 mx-auto mb-4 object-contain" />
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${primaryColor}18` }}
              >
                <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                </svg>
              </div>
            )}
            <h1 className="font-serif text-2xl tracking-tight text-neutral-900">{orgName}</h1>
            <p className="text-xs text-neutral-400 mt-1">
              {view === 'signup' ? 'Create your account' : view === 'forgot' ? 'Reset your password' : 'Sign in to your account'}
            </p>
          </div>

          <div className="px-8 pb-8">

            {/* ── Standard login ── */}
            {view === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-medium rounded-xl px-4 py-3 text-sm text-white tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </button>

                <div className="pt-3 border-t border-neutral-100 space-y-2 text-center">
                  <div>
                    <button
                      type="button"
                      onClick={() => { setView('signup'); setError(null) }}
                      className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      New here? Create an account →
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(null) }}
                      className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── Self-registration ── */}
            {view === 'signup' && (
              <>
                {signupDone ? (
                  <div className="text-center py-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="font-serif text-xl text-neutral-900 mb-2">Check your email</h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      We sent a confirmation link to <span className="text-neutral-800 font-medium">{email}</span>. Click it to activate your account.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setView('login'); setSignupDone(false); setSignupName(''); setPassword(''); setConfirmPassword('') }}
                      className="mt-6 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        required
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        placeholder="Jane Smith"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputCls}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-500">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-medium rounded-xl px-4 py-3 text-sm text-white tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account…
                        </>
                      ) : 'Create Account'}
                    </button>

                    <div className="pt-3 border-t border-neutral-100 text-center">
                      <button
                        type="button"
                        onClick={() => { setView('login'); setError(null) }}
                        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* ── Forgot password ── */}
            {view === 'forgot' && (
              <>
                {resetSent ? (
                  <div className="text-center py-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="font-serif text-xl text-neutral-900 mb-2">Check your email</h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      We sent a setup link to <span className="text-neutral-800 font-medium">{email}</span>. Click it to create your password.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setView('login'); setResetSent(false); setEmail('') }}
                      className="mt-6 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Enter your email and we'll send you a link to set up your password.
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-500">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-medium rounded-xl px-4 py-3 text-sm text-white tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : 'Send Setup Link'}
                    </button>

                    <div className="pt-3 border-t border-neutral-100 text-center">
                      <button
                        type="button"
                        onClick={() => { setView('login'); setError(null) }}
                        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-5">
          Contact your provider if you need access.
        </p>
      </div>
    </div>
  )
}
