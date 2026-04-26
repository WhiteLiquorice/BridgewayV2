import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface OrgConfig {
  id: string
  name: string
  description?: string
  logoUrl?: string
  primaryColor?: string
  hoursStart: string
  hoursEnd: string
  bookingLeadTimeHours: number
  cancellationWindowHours: number
  services: Service[]
  blockedDates: BlockedDate[]
  googleCalendarConnected: boolean
  stripePublishableKey?: string
  paymentRequired?: boolean
}

interface Service {
  id: string
  name: string
  durationMinutes: number
  price: number
  active: boolean
}

interface BlockedDate {
  id: string
  date: string
  reason?: string
}

interface AuthContextValue {
  user: any | null
  orgConfig: OrgConfig | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [orgConfig, setOrgConfig] = useState<OrgConfig | null>(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Load this user's org config from Firestore
        try {
          const orgRef = doc(db, 'bookingOrgs', firebaseUser.uid)
          const orgSnap = await getDoc(orgRef)
          if (orgSnap.exists()) {
            setOrgConfig({ id: orgSnap.id, ...orgSnap.data() } as OrgConfig)
          }
        } catch {
          // Non-fatal — user may not have an org doc yet (first sign-in)
          setOrgConfig(null)
        }
      } else {
        setOrgConfig(null)
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
    <AuthContext.Provider value={{ user, orgConfig, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
