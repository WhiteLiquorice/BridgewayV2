import { createContext, useContext, useEffect, useState } from 'react'
import { dataconnect } from '../lib/firebase'
import { getOrgSettings } from '@bridgeway/database'
import { useAuth } from './AuthContext'

const DEFAULT_TERMS = {
  client:      { singular: 'Client',      plural: 'Clients' },
  appointment: { singular: 'Appointment', plural: 'Appointments' },
  staff:       { singular: 'Staff',       plural: 'Staff' },
}

const TerminologyContext = createContext({ terms: DEFAULT_TERMS, loading: false, refresh: () => {} })

export function TerminologyProvider({ children }) {
  const { profile } = useAuth()
  const [terms, setTerms] = useState(DEFAULT_TERMS)
  const [loading, setLoading] = useState(false)

  async function load() {
    const orgId = profile?.org_id
    if (!orgId) return
    setLoading(true)
    try {
      const { data } = await getOrgSettings(dataconnect, { orgId })
      const settings = data?.orgSettings?.[0]
      // Since terminology is not stored in V2 schema, we use default terms
      setTerms(DEFAULT_TERMS)
    } catch (err) {
      console.error('Failed to load terminology:', err)
      setTerms(DEFAULT_TERMS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [profile?.org_id])

  return (
    <TerminologyContext.Provider value={{ terms, loading, refresh: load }}>
      {children}
    </TerminologyContext.Provider>
  )
}

export function useTerminology() {
  return useContext(TerminologyContext)
}
