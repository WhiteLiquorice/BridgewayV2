import { createContext, useContext, useEffect, useState } from 'react'
import { auth as firebaseAuth, dataconnect } from '../lib/firebase'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getUserProfile } from '@bridgeway/database'

const AuthContext = createContext(null)

/**
 * Normalize a raw profile object so that consumers can use either the
 * camelCase fields returned by DataConnect (orgId, userId, fullName) OR
 * the snake_case aliases that the existing widgets/pages use (org_id,
 * user_id, full_name).  Both sets of keys will always be present.
 */
function normalizeProfile(raw) {
  if (!raw) return null
  return {
    ...raw,
    // camelCase → snake_case aliases
    org_id:    raw.orgId    ?? raw.org_id    ?? null,
    user_id:   raw.userId   ?? raw.user_id   ?? null,
    full_name: raw.fullName ?? raw.full_name ?? null,
    // also ensure camelCase fields are present when raw used snake_case
    orgId:    raw.orgId    ?? raw.org_id    ?? null,
    userId:   raw.userId   ?? raw.user_id   ?? null,
    fullName: raw.fullName ?? raw.full_name ?? null,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [profile, setProfile]   = useState(null)
  const [org, setOrg]           = useState(null)
  const [loading, setLoading]   = useState(true)

  async function loadProfile(userId) {
    if (!userId) { 
      setProfile(null); 
      setOrg(null); 
      return 
    }

    // Check if user is anonymous (Firebase) - Hardcoded Demo Mapping
    if (firebaseAuth.currentUser?.isAnonymous) {
      const demoProfile = normalizeProfile({
        id: 'demo-user',
        userId: userId,
        fullName: 'Demo Provider',
        email: 'demo@wellnessco.com',
        role: 'staff',
        orgId: 'aaaaaaaa-0000-0000-0000-000000000001'
      })
      const demoOrg = {
        id: 'aaaaaaaa-0000-0000-0000-000000000001',
        name: 'Wellness Co',
        slug: 'wellness-co',
        status: 'active',
        onboardingComplete: true,
      }
      setProfile(demoProfile)
      setOrg(demoOrg)
      return
    }

    try {
      const { data } = await getUserProfile(dataconnect);
      const prof = data.profiles[0];
      if (prof) {
        setProfile(normalizeProfile(prof));
        setOrg(prof.org);
      } else {
        setProfile(null);
        setOrg(null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === 'true') {
      setMockDemoSession()
      setLoading(false)
      return
    }

    const unSubFirebase = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setSession({ user })
        loadProfile(user.uid)
      } else {
        setSession(null); 
        setProfile(null); 
        setOrg(null);
      }
      setLoading(false)
    })

    return () => unSubFirebase()
  }, [])

  // Idle auto-logout
  useEffect(() => {
    if (!session || !org || !profile) return
    const mins = ({
      staff:   org.sessionTimeoutStaffMin   ?? 30,
      manager: org.sessionTimeoutManagerMin ?? 240,
      admin:   org.sessionTimeoutAdminMin   ?? 480,
      patient: org.sessionTimeoutPatientMin ?? 480,
    })[profile.role] ?? 480

    if (mins === 0) return
    const ms = mins * 60 * 1000
    let timer
    const reset = () => { 
      clearTimeout(timer); 
      timer = setTimeout(() => firebaseAuth.signOut(), ms) 
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => document.addEventListener(e, reset, true))
    reset()
    return () => { 
      clearTimeout(timer); 
      events.forEach(e => document.removeEventListener(e, reset, true)) 
    }
  }, [session?.user?.uid, profile?.role,
      org?.sessionTimeoutStaffMin, org?.sessionTimeoutManagerMin,
      org?.sessionTimeoutAdminMin, org?.sessionTimeoutPatientMin])

  const setMockDemoSession = () => {
    const demoProfile = normalizeProfile({
      id: 'demo-user',
      userId: 'demo-user',
      fullName: 'Demo Provider',
      email: 'demo@wellnessco.com',
      role: 'staff',
      orgId: 'aaaaaaaa-0000-0000-0000-000000000001'
    })
    const demoOrg = {
      id: 'aaaaaaaa-0000-0000-0000-000000000001',
      name: 'Wellness Co',
      slug: 'wellness-co',
      status: 'active',
      onboardingComplete: true,
    }
    setSession({ user: { uid: 'demo-user' } })
    setProfile(demoProfile)
    setOrg(demoOrg)

    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <AuthContext.Provider value={{ 
      session, 
      user: session?.user ?? null, 
      profile, 
      org, 
      loading, 
      setMockDemoSession,
      signInAnonymously: () => signInAnonymously(firebaseAuth),
      signOut: () => firebaseAuth.signOut()
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
