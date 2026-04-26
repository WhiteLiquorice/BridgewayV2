import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { auth as firebaseAuth } from '../lib/firebase'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [org,     setOrg]     = useState(null)
  const [orgSettings, setOrgSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    if (!userId) { setProfile(null); setOrg(null); setOrgSettings(null); return }
    
    // Check if user is anonymous (Firebase)
    if (firebaseAuth.currentUser?.isAnonymous) {
      const demoProfile = {
        id: 'demo-user',
        userId: userId,
        fullName: 'Demo Owner',
        email: 'demo@bridgewayapps.com',
        role: 'admin',
        org_id: 'aaaaaaaa-0000-0000-0000-000000000001'
      }
      const demoOrg = {
        id: 'aaaaaaaa-0000-0000-0000-000000000001',
        name: 'Bridgeway Demo Practice',
        slug: 'demo',
        status: 'active'
      }
      setProfile(demoProfile)
      setOrg(demoOrg)
      setOrgSettings({ payment_required: false })
      return
    }

    try {
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('user_id', userId).maybeSingle()
      setProfile(prof ?? null)
      if (prof?.org_id) {
        const [orgRes, settingsRes] = await Promise.all([
          supabase.from('orgs').select('*').eq('id', prof.org_id).maybeSingle(),
          supabase.from('org_settings').select('stripe_customer_id, stripe_subscription_id, payment_past_due')
            .eq('org_id', prof.org_id).maybeSingle(),
        ])
        setOrg(orgRes.data ?? null)
        setOrgSettings(settingsRes.data ?? null)
      } else {
        setOrg(null)
        setOrgSettings(null)
      }
    } catch {
      // Network error — leave any existing profile/org in place
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === 'true') {
      setMockDemoSession()
      setLoading(false)
      return
    }

    // 1. Supabase Auth Listener (Legacy/Transition)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Only clear if no firebase user either
        if (!firebaseAuth.currentUser) {
          setSession(null); setProfile(null); setOrg(null); setOrgSettings(null)
        }
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setSession(session)
        loadProfile(session?.user?.id ?? null)
      }
    })

    // 2. Firebase Auth Listener (New)
    const unSubFirebase = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // Handle firebase user
        // For now, we'll use session as a generic "user exists" indicator
        setSession({ user } as any)
        loadProfile(user.uid)
      } else {
        // If no supabase session either, clear
        supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
          if (!sbSession) {
            setSession(null); setProfile(null); setOrg(null); setOrgSettings(null)
          }
        })
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      unSubFirebase()
    }
  }, [])

  // Idle auto-logout: sign out after the role-specific inactivity timeout.
  // Runs only when session + org + profile are all loaded.
  // Set timeout to 0 in Admin → Org Setup to disable for a role.
  useEffect(() => {
    if (!session || !org || !profile) return
    const mins = ({
      staff:   org.session_timeout_staff_min   ?? 30,
      manager: org.session_timeout_manager_min ?? 240,
      admin:   org.session_timeout_admin_min   ?? 480,
      patient: org.session_timeout_patient_min ?? 480,
    })[profile.role] ?? 480
    if (mins === 0) return
    const ms = mins * 60 * 1000
    let timer
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => supabase.auth.signOut(), ms) }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => document.addEventListener(e, reset, true))
    reset()
    return () => { clearTimeout(timer); events.forEach(e => document.removeEventListener(e, reset, true)) }
  }, [session?.user?.id, profile?.role,
      org?.session_timeout_staff_min, org?.session_timeout_manager_min,
      org?.session_timeout_admin_min, org?.session_timeout_patient_min])

  const setMockDemoSession = () => {
    const demoProfile = {
      id: 'demo-user',
      user_id: 'demo-user',
      full_name: 'Demo Owner',
      email: 'demo@bridgewayapps.com',
      role: 'admin',
      org_id: 'aaaaaaaa-0000-0000-0000-000000000001'
    }
    const demoOrg = {
      id: 'aaaaaaaa-0000-0000-0000-000000000001',
      name: 'Bridgeway Demo Practice',
      slug: 'demo',
      status: 'active'
    }
    setSession({ user: { id: 'demo-user' } })
    setProfile(demoProfile)
    setOrg(demoOrg)
    setOrgSettings({ payment_required: false })

    // Clean up URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      profile,
      org,
      orgSettings,
      role: profile?.role ?? null,
      loading,
      setMockDemoSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return {
    ...context,
    signInAnonymously: () => signInAnonymously(firebaseAuth),
  }
}
