import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
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
      const { data } = await supabase
        .from('org_settings')
        .select('terminology')
        .eq('org_id', orgId)
        .maybeSingle()
      if (data?.terminology) {
        // Merge so missing keys fall back to defaults
        setTerms({
          client:      { ...DEFAULT_TERMS.client,      ...(data.terminology.client      || {}) },
          appointment: { ...DEFAULT_TERMS.appointment, ...(data.terminology.appointment || {}) },
          staff:       { ...DEFAULT_TERMS.staff,       ...(data.terminology.staff       || {}) },
        })
      } else {
        setTerms(DEFAULT_TERMS)
      }
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
