import { createContext, useContext, useEffect, useState } from 'react'
import { auth as firebaseAuth, dataconnect } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from '@bridgeway/database'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession]   = useState<any>(null)
  const [profile, setProfile]   = useState<any>(null)
  const [org, setOrg]           = useState<any>(null)
  const [loading, setLoading]   = useState(true)

  async function loadProfile(userId: string | null) {
    if (!userId) { setProfile(null); setOrg(null); return }
    try {
      const { data } = await getUserProfile(dataconnect);
      const prof = data.profiles[0];
      
      if (prof) {
        setProfile({
          ...prof,
          org_id: prof.org.id,
          user_id: prof.userId,
          full_name: prof.fullName,
        });
        setOrg({
          ...prof.org,
          session_timeout_staff_min: 30, // Default fallbacks since dataconnect schema might differ slightly
          session_timeout_manager_min: 240,
          session_timeout_admin_min: 480,
          session_timeout_patient_min: 480,
        });
      } else {
        setProfile(null)
        setOrg(null)
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      // Network error — leave any existing profile/org in place
    }
  }

  useEffect(() => {
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

  // Idle auto-logout: sign out after the role-specific inactivity timeout.
  // Runs only when session + org + profile are all loaded.
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
    let timer: NodeJS.Timeout
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => firebaseAuth.signOut(), ms) }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => document.addEventListener(e, reset, true))
    reset()
    return () => { clearTimeout(timer); events.forEach(e => document.removeEventListener(e, reset, true)) }
  }, [session?.user?.uid, profile?.role,
      org?.session_timeout_staff_min, org?.session_timeout_manager_min,
      org?.session_timeout_admin_min, org?.session_timeout_patient_min])

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      profile,
      org,
      role: profile?.role ?? null,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
