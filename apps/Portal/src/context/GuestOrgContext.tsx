import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const GuestOrgContext = createContext(null)

export function GuestOrgProvider({ children }) {
  const [org,     setOrg]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug   = params.get('org')
    if (!slug) {
      setError('No organization specified. Add ?org=your-slug to the URL.')
      setLoading(false)
      return
    }
    supabase
      .from('orgs')
      .select('id, name, slug, primary_color, secondary_color, logo_url')
      .eq('slug', slug)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) setError('Organization not found.')
        else setOrg(data)
        setLoading(false)
      })
  }, [])

  return (
    <GuestOrgContext.Provider value={{ org, loading, error }}>
      {children}
    </GuestOrgContext.Provider>
  )
}

export function useGuestOrg() { return useContext(GuestOrgContext) }
