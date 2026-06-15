import { createContext, useContext, useEffect, useState } from 'react'
import { dataconnect } from '../lib/firebase'
import { getBookingPageData } from '@bridgeway/database'

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
    getBookingPageData(dataconnect, { slug })
      .then(({ data }) => {
        const orgInfo = data.orgs[0]
        if (!orgInfo) {
          setError('Organization not found.')
        } else {
          setOrg({
            ...orgInfo,
            primary_color: orgInfo.primaryColor,
            secondary_color: orgInfo.secondaryColor,
            logo_url: orgInfo.logoUrl,
            services: (orgInfo.services_on_org || []).map((s: any) => ({
              ...s,
              duration_minutes: s.durationMinutes
            })),
            booking_config: orgInfo.orgSetting_on_org?.bookingConfig || null
          } as any)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Error loading organization.')
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
