import { createContext, useContext, useEffect, useState } from 'react'
import { auth as firebaseAuth, dataconnect } from '../lib/firebase'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getUserProfile, getOrgSettings } from '@bridgeway/database'

const AuthContext = createContext(null)

/**
 * Normalize a raw profile object so that consumers can use either the
 * camelCase fields returned by DataConnect (orgId, userId, fullName) OR
 * the snake_case aliases used by existing components (org_id, user_id,
 * full_name).  Both sets of keys will always be present.
 */
function normalizeProfile(raw) {
  if (!raw) return null
  return {
    ...raw,
    org_id:    raw.orgId    ?? raw.org_id    ?? null,
    user_id:   raw.userId   ?? raw.user_id   ?? null,
    full_name: raw.fullName ?? raw.full_name ?? null,
    orgId:     raw.orgId    ?? raw.org_id    ?? null,
    userId:    raw.userId   ?? raw.user_id   ?? null,
    fullName:  raw.fullName ?? raw.full_name ?? null,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [org,     setOrg]     = useState(null)
  const [orgSettings, setOrgSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    if (!userId) { 
      setProfile(null); 
      setOrg(null); 
      setOrgSettings(null); 
      return 
    }
    
    // Check if user is anonymous (Firebase) - Hardcoded Demo Mapping
    if (firebaseAuth.currentUser?.isAnonymous) {
      const demoProfile = normalizeProfile({
        id: 'demo-user',
        userId: userId,
        fullName: 'Demo Owner',
        email: 'demo@wellnessco.com',
        role: 'admin',
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
      setOrgSettings({ paymentRequired: false })
      return
    }

    try {
      // 1. Fetch Profile and Org via Data Connect
      const { data } = await getUserProfile(dataconnect);
      const prof = data.profiles[0];
      
      if (prof) {
        setProfile(normalizeProfile(prof));
        setOrg(prof.org);

        // 2. Fetch Org Settings
        if (prof.org?.id) {
          const { data: settingsData } = await getOrgSettings(dataconnect, { orgId: prof.org.id });
          setOrgSettings(settingsData.orgSettings[0] ?? null);
        }
      } else {
        setProfile(null);
        setOrg(null);
        setOrgSettings(null);
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

    // Firebase Auth Listener
    const unSubFirebase = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setSession({ user })
        loadProfile(user.uid)
      } else {
        setSession(null); 
        setProfile(null); 
        setOrg(null); 
        setOrgSettings(null);
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
      fullName: 'Demo Owner',
      email: 'demo@wellnessco.com',
      role: 'admin',
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
    setOrgSettings({ paymentRequired: false })

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
    signOut: () => firebaseAuth.signOut(),
  }
}
