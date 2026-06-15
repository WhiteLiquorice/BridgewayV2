import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const DEFAULT_TERMS = {
  client:      { singular: 'Client',      plural: 'Clients' },
  appointment: { singular: 'Appointment', plural: 'Appointments' },
  staff:       { singular: 'Staff',       plural: 'Staff' },
}

const TerminologyContext = createContext({ terms: DEFAULT_TERMS, loading: false })

export function TerminologyProvider({ children }) {
  const { profile } = useAuth()
  const [terms, setTerms] = useState(DEFAULT_TERMS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const orgId = profile?.org_id
    if (!orgId) return
    setLoading(true)
    try {
      const stored = localStorage.getItem('bw_terminology_' + orgId)
      if (stored) {
        const parsed = JSON.parse(stored)
        setTerms({
          client:      { ...DEFAULT_TERMS.client,      ...(parsed.client      || {}) },
          appointment: { ...DEFAULT_TERMS.appointment, ...(parsed.appointment || {}) },
          staff:       { ...DEFAULT_TERMS.staff,       ...(parsed.staff       || {}) },
        })
      } else {
        setTerms(DEFAULT_TERMS)
      }
    } catch (err) {
      console.error('Failed to load terminology:', err)
      setTerms(DEFAULT_TERMS)
    } finally {
      setLoading(false)
    }
  }, [profile?.org_id])

  return (
    <TerminologyContext.Provider value={{ terms, loading }}>
      {children}
    </TerminologyContext.Provider>
  )
}

export function useTerminology() {
  return useContext(TerminologyContext)
}
