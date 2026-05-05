import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { 
  getOrgSettings, 
  updateOrgBranding, 
  updateOrgSettings 
} from '@bridgeway/database'
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import { getGoogleOAuthUrl, disconnectGoogleCalendar } from '../lib/firebase'

const DASHBOARD_WIDGETS = [
  { id: 'todaySchedule',           label: "Today's Schedule" },
  { id: 'upcomingBookings',        label: 'Upcoming Bookings' },
  { id: 'unconfirmedAppointments', label: 'Unconfirmed Appointments' },
  { id: 'liveQueue',               label: 'Live Queue' },
  { id: 'theFloor',                label: 'The Floor' },
  { id: 'waitingRoom',             label: 'Waiting Room Queue' },
  { id: 'waitlistManager',         label: 'Waitlist Manager' },
  { id: 'classSchedule',           label: 'Class Schedule' },
  { id: 'staffRoster',             label: 'Staff Roster' },
  { id: 'quickLookup',             label: 'Quick Client Lookup' },
  { id: 'clientRetention',         label: 'Client Retention' },
  { id: 'packageTracker',          label: 'Package Tracker' },
  { id: 'revenue',                 label: 'Revenue' },
  { id: 'announcements',           label: 'Announcements' },
  { id: 'clock',                   label: 'Clock' },
]

export default function OrgSetup() {
  const { org, profile } = useAuth()

  // Form fields
  const [name,         setName]         = useState('')
  const [address,      setAddress]      = useState('')
  const [phone,        setPhone]        = useState('')
  const [website,      setWebsite]      = useState('')
  const [primaryColor,   setPrimaryColor]   = useState('#f59e0b')
  const [secondaryColor, setSecondaryColor] = useState('#c9a84c')
  const [logoUrl,      setLogoUrl]      = useState('')
  const [layoutTheme,  setLayoutTheme]  = useState('modern')
  const [appTheme,     setAppTheme]     = useState('modern')

  const [timeoutAdmin,   setTimeoutAdmin]   = useState(480)
  const [timeoutManager, setTimeoutManager] = useState(480)
  const [timeoutStaff,   setTimeoutStaff]   = useState(30)

  const [disabledWidgets, setDisabledWidgets] = useState([])
  const [bookingShowProviders,    setBookingShowProviders]    = useState(true)
  const [bookingRequirePhone,     setBookingRequirePhone]     = useState(false)
  const [bookingAllowPhotoUpload, setBookingAllowPhotoUpload] = useState(false)
  const [bookingWelcomeText,      setBookingWelcomeText]      = useState('')
  const [bookingConfirmationText, setBookingConfirmationText] = useState('')
  const [bookingCopied,           setBookingCopied]           = useState(false)

  // Google Calendar
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [connectingCalendar, setConnectingCalendar] = useState(false)
  const [disconnectingCalendar, setDisconnectingCalendar] = useState(false)

  const [saveStatus,    setSaveStatus]    = useState('idle')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoError,     setLogoError]     = useState(null)
  const [initialized,   setInitialized]   = useState(false)

  const fileInputRef  = useRef(null)
  const autoSaveTimer = useRef(null)

  useEffect(() => {
    if (org) {
      setName(org.name || '')
      setAddress(org.address || '')
      setPhone(org.phone || '')
      setWebsite(org.website || '')
      setPrimaryColor(org.primaryColor || '#f59e0b')
      setSecondaryColor(org.secondaryColor || '#c9a84c')
      setLogoUrl(org.logoUrl || '')
      setLayoutTheme(org.layoutTheme || 'modern')
      setAppTheme(org.appTheme || 'modern')
      setTimeoutAdmin(org.sessionTimeoutAdminMin ?? 480)
      setTimeoutManager(org.sessionTimeoutManagerMin ?? 480)
      setTimeoutStaff(org.sessionTimeoutStaffMin ?? 30)
      setTimeout(() => setInitialized(true), 100)
    }
  }, [org?.id])

  useEffect(() => {
    if (!org?.id) return
    getOrgSettings(dataconnect, { orgId: org.id })
      .then(({ data }) => {
        const settings = data.orgSettings[0]
        if (settings) {
          setDisabledWidgets(Array.isArray(settings.disabledWidgets) ? settings.disabledWidgets : [])
          const bc = settings.bookingConfig || {}
          if (bc.showProviders     !== undefined) setBookingShowProviders(bc.showProviders)
          if (bc.requirePhone      !== undefined) setBookingRequirePhone(bc.requirePhone)
          if (settings.allowPhotoUpload !== null && settings.allowPhotoUpload !== undefined) {
            setBookingAllowPhotoUpload(settings.allowPhotoUpload)
          } else if (bc.allowPhotoUpload !== undefined) {
            setBookingAllowPhotoUpload(bc.allowPhotoUpload)
          }
          if (bc.welcomeText       !== undefined) setBookingWelcomeText(bc.welcomeText)
          if (bc.confirmationText  !== undefined) setBookingConfirmationText(bc.confirmationText)
        }
        
        // Also check if calendar is connected
        setCalendarConnected(!!settings?.externalCalendarSyncEnabled)
      })
  }, [org?.id])

  useEffect(() => {
    if (!initialized || !org?.id) return
    clearTimeout(autoSaveTimer.current)
    setSaveStatus('idle')
    autoSaveTimer.current = setTimeout(doSave, 1500)
    return () => clearTimeout(autoSaveTimer.current)
  }, [name, address, phone, website, primaryColor, secondaryColor, appTheme, timeoutAdmin, timeoutManager, timeoutStaff,
      bookingShowProviders, bookingRequirePhone, bookingAllowPhotoUpload, bookingWelcomeText, bookingConfirmationText, initialized])

  async function doSave(overrides = {}) {
    if (!org?.id) return
    setSaveStatus('saving')
    try {
      await updateOrgBranding(dataconnect, {
        id: org.id,
        name, address, phone, website,
        primaryColor,
        secondaryColor,
        layoutTheme: overrides.layoutTheme || layoutTheme,
        appTheme,
        sessionTimeoutAdminMin:   Number(timeoutAdmin),
        sessionTimeoutManagerMin: Number(timeoutManager),
        sessionTimeoutStaffMin:   Number(timeoutStaff),
        logoUrl: overrides.logoUrl || logoUrl
      })

      await updateOrgSettings(dataconnect, {
        orgId: org.id,
        disabledWidgets,
        allowPhotoUpload: bookingAllowPhotoUpload,
        bookingConfig: {
          showProviders:    bookingShowProviders,
          requirePhone:     bookingRequirePhone,
          allowPhotoUpload: bookingAllowPhotoUpload,
          welcomeText:      bookingWelcomeText,
          confirmationText: bookingConfirmationText,
        }
      })

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err) {
      console.error(err)
      setSaveStatus('error')
    }
  }

  async function handleLayoutThemeChange(id) {
    setLayoutTheme(id)
    clearTimeout(autoSaveTimer.current)
    setSaveStatus('saving')
    try {
      await updateOrgBranding(dataconnect, {
        id: org.id,
        name, address, phone, website, primaryColor, secondaryColor,
        layoutTheme: id,
        appTheme,
        sessionTimeoutAdminMin: timeoutAdmin,
        sessionTimeoutManagerMin: timeoutManager,
        sessionTimeoutStaffMin: timeoutStaff,
        logoUrl
      })
      setSaveStatus('saved')
      setTimeout(() => window.location.reload(), 600)
    } catch {
      setSaveStatus('error')
    }
  }

  function toggleWidget(id) {
    const next = disabledWidgets.includes(id)
      ? disabledWidgets.filter(w => w !== id)
      : [...disabledWidgets, id]
    setDisabledWidgets(next)
    clearTimeout(autoSaveTimer.current)
    updateOrgSettings(dataconnect, {
      orgId: org.id,
      disabledWidgets: next,
      allowPhotoUpload: bookingAllowPhotoUpload,
      bookingConfig: {
        showProviders:    bookingShowProviders,
        requirePhone:     bookingRequirePhone,
        allowPhotoUpload: bookingAllowPhotoUpload,
        welcomeText:      bookingWelcomeText,
        confirmationText: bookingConfirmationText,
      }
    }).then(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }).catch(() => setSaveStatus('error'))
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !org?.id) return
    setLogoError(null)
    setUploadingLogo(true)
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `org-assets/${org.id}/logo`);
      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);
      
      await updateOrgBranding(dataconnect, {
        id: org.id,
        name, address, phone, website, primaryColor, secondaryColor,
        layoutTheme, appTheme, 
        sessionTimeoutAdminMin: timeoutAdmin,
        sessionTimeoutManagerMin: timeoutManager,
        sessionTimeoutStaffMin: timeoutStaff,
        logoUrl: publicUrl
      })
      
      setLogoUrl(publicUrl)
    } catch (err) {
      setLogoError('Upload failed — ' + err.message)
    } finally {
      setUploadingLogo(false)
    }
  }

  if (!profile || !org) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  async function handleConnectCalendar() {
    if (!org?.id) return
    setConnectingCalendar(true)
    try {
      const redirectUri = `${window.location.origin}/admin/oauth/google`
      const result = await getGoogleOAuthUrl({ orgId: org.id, redirectUri })
      window.location.href = result.data.url
    } catch (err) {
      console.error('Failed to get OAuth URL', err)
      setConnectingCalendar(false)
    }
  }

  async function handleDisconnectCalendar() {
    if (!org?.id) return
    setDisconnectingCalendar(true)
    try {
      await disconnectGoogleCalendar({ orgId: org.id })
      setCalendarConnected(false)
    } catch (err) {
      console.error('Failed to disconnect calendar', err)
    }
    setDisconnectingCalendar(false)
  }

  return (
    <div className="p-8 max-w-2xl text-white">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Org Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Changes save automatically.</p>
        </div>
        <div className="flex-shrink-0 text-sm pt-1">
          {saveStatus === 'saving' && <span className="text-gray-400">Saving…</span>}
          {saveStatus === 'saved'  && <span className="text-green-400">Saved ✓</span>}
          {saveStatus === 'error'  && <span className="text-red-400">Save failed</span>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Practice Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Practice Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="Wellness Co"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Address</label>
              <input
                type="text" value={address} onChange={e => setAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="123 Main St, Suite 100, City, ST 00000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Website</label>
                <input
                  type="url" value={website} onChange={e => setWebsite(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="https://wellnessco.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Branding</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Logo</label>
              {logoUrl && (
                <div className="mb-3">
                  <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-gray-800 border border-gray-700 p-1" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingLogo}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploadingLogo ? 'Uploading…' : logoUrl ? 'Replace Logo' : 'Upload Logo'}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              {logoError && <p className="mt-2 text-red-400 text-xs">{logoError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Primary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5" />
                <span className="text-sm text-gray-400 font-mono">{primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5" />
                <span className="text-sm text-gray-400 font-mono">{secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Layout & Theme</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['modern', 'executive', 'minimal', 'classic'].map(id => (
              <button key={id} type="button" onClick={() => handleLayoutThemeChange(id)}
                className={`text-left p-3 rounded-lg border-2 transition-all capitalize ${
                  layoutTheme === id ? 'border-brand bg-brand/5 text-brand' : 'border-gray-700 bg-gray-800/50 text-white'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['modern', 'luxury'].map(id => (
              <button key={id} type="button" onClick={() => setAppTheme(id)}
                className={`text-left p-3 rounded-lg border-2 transition-all capitalize ${
                  appTheme === id ? 'border-brand bg-brand/5 text-brand' : 'border-gray-700 bg-gray-800/50 text-white'
                }`}
              >
                {id} Theme
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Session Timeouts (min)</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Admin',   value: timeoutAdmin,   set: setTimeoutAdmin },
              { label: 'Manager', value: timeoutManager, set: setTimeoutManager },
              { label: 'Staff',   value: timeoutStaff,   set: setTimeoutStaff },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <input type="number" value={value} onChange={e => set(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Widget Visibility</h2>
          <div className="grid grid-cols-2 gap-2">
            {DASHBOARD_WIDGETS.map(({ id, label }) => {
              const enabled = !disabledWidgets.includes(id)
              return (
                <button key={id} type="button" onClick={() => toggleWidget(id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                    enabled ? 'bg-brand/10 border-brand/20 text-brand' : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}
                >
                  <span className="text-xs">{label}</span>
                  <span>{enabled ? '✓' : '×'}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-4">Booking Experience</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-sm">Show provider selection</span>
              <input type="checkbox" checked={bookingShowProviders} onChange={e => setBookingShowProviders(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-sm">Require phone number</span>
              <input type="checkbox" checked={bookingRequirePhone} onChange={e => setBookingRequirePhone(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-sm">Allow clients to upload reference photos</span>
              <input type="checkbox" checked={bookingAllowPhotoUpload} onChange={e => setBookingAllowPhotoUpload(e.target.checked)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Welcome Message</label>
              <input type="text" value={bookingWelcomeText} onChange={e => setBookingWelcomeText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmation Message</label>
              <input type="text" value={bookingConfirmationText} onChange={e => setBookingConfirmationText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Connection */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-white font-semibold text-base mb-1">Google Calendar Sync</h2>
          <p className="text-gray-400 text-sm">
            Connect your Google Calendar to automatically block out times when you're busy and add new bookings to your schedule.
          </p>
        </div>
        <div className="p-6">
          {calendarConnected ? (
            <div className="flex items-center justify-between bg-[#0c1a2e] border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Calendar Connected</p>
                  <p className="text-xs text-gray-400">Events are syncing successfully</p>
                </div>
              </div>
              <button
                onClick={handleDisconnectCalendar}
                disabled={disconnectingCalendar}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {disconnectingCalendar ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#0c1a2e] border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-full">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.0004 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12.0004 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12.0004 0ZM12.0004 21.6C6.69842 21.6 2.4 17.3016 2.4 12C2.4 6.69842 6.69842 2.4 12.0004 2.4C17.3016 2.4 21.6 6.69842 21.6 12C21.6 17.3016 17.3016 21.6 12.0004 21.6Z" />
                    <path d="M12.0004 6V12L16.2426 16.2426" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Not Connected</p>
                  <p className="text-xs text-gray-400">Connect to sync your availability</p>
                </div>
              </div>
              <button
                onClick={handleConnectCalendar}
                disabled={connectingCalendar}
                className="px-4 py-2 bg-white text-[#080f1d] hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {connectingCalendar ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
