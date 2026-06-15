import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, dataconnect } from '../lib/firebase'
import { getUserProfile } from '@bridgeway/database'

interface AuthContextValue {
  user: any | null
  profile: any | null
  org: any | null
  role: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<any>(null)
  const [profile, setProfile]   = useState<any>(null)
  const [org, setOrg]           = useState<any>(null)
  const [loading, setLoading]   = useState(true)

  async function loadProfile(userId: string | null) {
    if (!userId) {
      setProfile(null)
      setOrg(null)
      return
    }
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
        setOrg(prof.org);
      } else {
        setProfile(null)
        setOrg(null)
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await loadProfile(firebaseUser.uid)
      } else {
        setProfile(null)
        setOrg(null)
      }
      setLoading(false)
    })

    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      org,
      role: profile?.role ?? null,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
