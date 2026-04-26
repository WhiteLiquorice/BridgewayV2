import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// Dashboard widget list (hardcoded here — don't import across apps).
// Keep IDs in sync with Dashboard/src/widgets/registry.js.
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

  // Form fields — initialized from org in AuthContext
  const [name,         setName]         = useState('')
  const [address,      setAddress]      = useState('')
  const [phone,        setPhone]        = useState('')
  const [website,      setWebsite]      = useState('')
  const [primaryColor,   setPrimaryColor]   = useState('#f59e0b')
  const [secondaryColor, setSecondaryColor] = useState('#c9a84c')
  const [logoUrl,      setLogoUrl]      = useState('')
  const [layoutTheme,  setLayoutTheme]  = useState('modern')
  const [appTheme,     setAppTheme]     = useState('modern')

  // Session timeout fields (minutes per role)
  const [timeoutAdmin,   setTimeoutAdmin]   = useState(480)
  const [timeoutManager, setTimeoutManager] = useState(480)
  const [timeoutStaff,   setTimeoutStaff]   = useState(30)

  // Widget visibility — list of widget IDs hidden org-wide (from org_settings.disabled_widgets)
  const [disabledWidgets, setDisabledWidgets] = useState([])

  // Booking experience (from org_settings.booking_config)
  const [bookingShowProviders,    setBookingShowProviders]    = useState(true)
  const [bookingRequirePhone,     setBookingRequirePhone]     = useState(false)
  const [bookingWelcomeText,      setBookingWelcomeText]      = useState('')
  const [bookingConfirmationText, setBookingConfirmationText] = useState('')
  const [bookingCopied,           setBookingCopied]           = useState(false)

  const [saveStatus,    setSaveStatus]    = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoError,     setLogoError]     = useState(null)
  const [initialized,   setInitialized]   = useState(false)

  const fileInputRef  = useRef(null)
  const autoSaveTimer = useRef(null)

  // Populate form from org object once available
  useEffect(() => {
    if (org) {
      setName(org.name || '')
      setAddress(org.address || '')
      setPhone(org.phone || '')
      setWebsite(org.website || '')
      setPrimaryColor(org.primary_color || '#f59e0b')
      setSecondaryColor(org.secondary_color || '#c9a84c')
      setLogoUrl(org.logo_url || '')
      setLayoutTheme(org.layout_theme || 'modern')
      setAppTheme(org.app_theme || 'modern')
      setTimeoutAdmin(org.session_timeout_admin_min ?? 480)
      setTimeoutManager(org.session_timeout_manager_min ?? 480)
      setTimeoutStaff(org.session_timeout_staff_min ?? 30)
      // Mark initialized after a tick so the initial population doesn't trigger auto-save
      setTimeout(() => setInitialized(true), 100)
    }
  }, [org?.id])

  // Fetch org_settings on mount (disabled_widgets + booking_config).
  useEffect(() => {
    if (!profile?.org_id) return
    supabase.from('org_settings')
      .select('disabled_widgets, booking_config')
      .eq('org_id', profile.org_id)
      .maybeSingle()
      .then(({ data }) => {
        setDisabledWidgets(Array.isArray(data?.disabled_widgets) ? data.disabled_widgets : [])
        if (data?.booking_config) {
          const bc = data.booking_config
          if (bc.show_providers     !== undefined) setBookingShowProviders(bc.show_providers)
          if (bc.require_phone      !== undefined) setBookingRequirePhone(bc.require_phone)
          if (bc.welcome_text       !== undefined) setBookingWelcomeText(bc.welcome_text)
          if (bc.confirmation_text  !== undefined) setBookingConfirmationText(bc.confirmation_text)
        }
      })
  }, [profile?.org_id])

  // ── Auto-save: debounced for text/color fields ────────────────────────────
  useEffect(() => {
    if (!initialized || !org?.id) return
    clearTimeout(autoSaveTimer.current)
    setSaveStatus('idle')
    autoSaveTimer.current = setTimeout(doSave, 1500)
    return () => clearTimeout(autoSaveTimer.current)
  }, [name, address, phone, website, primaryColor, secondaryColor, appTheme, timeoutAdmin, timeoutManager, timeoutStaff,
      bookingShowProviders, bookingRequirePhone, bookingWelcomeText, bookingConfirmationText, initialized])

  async function doSave(overrides = {}) {
    if (!org?.id) return
    setSaveStatus('saving')
    try {
      const { error: orgErr } = await supabase.from('orgs').update({
        name, address, phone, website,
        primary_color:   primaryColor,
        secondary_color: secondaryColor,
        layout_theme: layoutTheme,
        app_theme: appTheme,
        session_timeout_admin_min:   Number(timeoutAdmin),
        session_timeout_manager_min: Number(timeoutManager),
        session_timeout_staff_min:   Number(timeoutStaff),
        ...overrides,
      }).eq('id', org.id)
      if (orgErr) { setSaveStatus('error'); return }

      const { error: settingsErr } = await supabase.from('org_settings')
        .upsert({
          org_id: org.id,
          disabled_widgets: disabledWidgets,
          booking_config: {
            show_providers:    bookingShowProviders,
            require_phone:     bookingRequirePhone,
            welcome_text:      bookingWelcomeText,
            confirmation_text: bookingConfirmationText,
          },
        }, { onConflict: 'org_id' })
      if (settingsErr) { setSaveStatus('error'); return }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
    }
  }

  // Layout theme: immediate save then reload so the new layout renders
  async function handleLayoutThemeChange(id) {
    setLayoutTheme(id)
    clearTimeout(autoSaveTimer.current)
    setSaveStatus('saving')
    try {
      await supabase.from('orgs').update({ layout_theme: id }).eq('id', org.id)
      setSaveStatus('saved')
      setTimeout(() => window.location.reload(), 600)
    } catch {
      setSaveStatus('error')
    }
  }

  // Widget toggle: immediate save, no reload needed
  function toggleWidget(id) {
    const next = disabledWidgets.includes(id)
      ? disabledWidgets.filter(w => w !== id)
      : [...disabledWidgets, id]
    setDisabledWidgets(next)
    clearTimeout(autoSaveTimer.current)
    supabase.from('org_settings')
      .upsert({ org_id: org.id, disabled_widgets: next }, { onConflict: 'org_id' })
      .then(({ error }) => {
        if (!error) { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500) }
        else setSaveStatus('error')
      })
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !org?.id) return
    setLogoError(null)
    setUploadingLogo(true)
    try {
      const path = `${org.id}/logo`
      const { error: uploadErr } = await supabase.storage
        .from('org-assets')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) { setLogoError(uploadErr.message); return }

      // Get public URL and persist to orgs table
      const { data: { publicUrl } } = supabase.storage.from('org-assets').getPublicUrl(path)
      const { error: updateErr } = await supabase
        .from('orgs').update({ logo_url: publicUrl }).eq('id', org.id)
      if (updateErr) { setLogoError(updateErr.message) } else { setLogoUrl(publicUrl) }
    } catch {
      setLogoError('Upload failed — check your connection and try again.')
    } finally {
      setUploadingLogo(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!org?.id) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const { error: err } = await supabase
        .from('orgs')
        .update({
          name, address, phone, website, primary_color: primaryColor, secondary_color: secondaryColor,
          layout_theme: layoutTheme,
          app_theme: appTheme,
          session_timeout_admin_min:   Number(timeoutAdmin),
          session_timeout_manager_min: Number(timeoutManager),
          session_timeout_staff_min:   Number(timeoutStaff),
        })
        .eq('id', org.id)
      if (err) {
        setError(err.message)
        return
      }

      // Persist widget visibility to org_settings (upsert — row may not exist yet).
      const { error: settingsErr } = await supabase
        .from('org_settings')
        .upsert({ org_id: org.id, disabled_widgets: disabledWidgets }, { onConflict: 'org_id' })
      if (settingsErr) {
        setError(settingsErr.message)
        return
      }

      setSuccess(true)
      // Reload to refresh org data in AuthContext
      setTimeout(() => window.location.reload(), 800)
    } catch {
      setError('Failed to save — check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!profile || !org) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Org Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Changes save automatically.</p>
        </div>
        <div className="flex-shrink-0 text-sm pt-1">
          {saveStatus === 'saving' && <span className="text-gray-400">Saving…</span>}
          {saveStatus === 'saved'  && <span className="text-green-400">Saved ✓</span>}
          {saveStatus === 'error'  && <span className="text-red-400">Save failed</span>}
        </div>
      </div>

      <div className="space-y-6">
        {/* Practice Info card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Practice Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Practice Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                placeholder="Bridgeway Therapy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                placeholder="123 Main St, Suite 100, City, ST 00000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Branding</h2>
          <div className="space-y-6">
            {/* Logo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Logo</label>
              <p className="text-xs text-gray-500 mb-3">
                Logo appears in the Dashboard and Client Portal sidebars. Recommended: square PNG, at least 64×64px.
              </p>
              {logoUrl && (
                <div className="mb-3">
                  <img
                    src={logoUrl}
                    alt="Current org logo"
                    className="w-16 h-16 rounded-lg object-contain bg-gray-800 border border-gray-700 p-1"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploadingLogo ? 'Uploading…' : logoUrl ? 'Replace Logo' : 'Upload Logo'}
                </button>
                {logoUrl && (
                  <span className="text-xs text-gray-500">Logo uploaded</span>
                )}
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoError && <p className="mt-2 text-red-400 text-xs">{logoError}</p>}
            </div>

            {/* Primary color */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
                />
                <span className="text-sm text-gray-400 font-mono">{primaryColor}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Used for the booking page header and primary UI surfaces.
              </p>
            </div>

            {/* Accent color */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
                />
                <span className="text-sm text-gray-400 font-mono">{secondaryColor}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Used for buttons, selected states, and highlights in the guest booking flow.
              </p>
            </div>
          </div>
        </div>

        {/* Layout Theme card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Layout Theme</h2>
          <p className="text-xs text-gray-500 mb-4">
            Choose a layout style for the Dashboard and Client Portal. This applies to everyone in your organization.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'modern',
                label: 'Modern',
                desc: 'Sidebar nav, card-based layout, colorful accents',
                preview: (
                  <div className="flex gap-1 h-14 w-full">
                    <div className="w-5 bg-gray-700 rounded-sm" />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-2 bg-gray-700/40 rounded-sm" />
                      <div className="flex-1 grid grid-cols-2 gap-1">
                        <div className="bg-gray-700/30 rounded-sm" />
                        <div className="bg-gray-700/30 rounded-sm" />
                        <div className="bg-gray-700/30 rounded-sm" />
                        <div className="bg-gray-700/30 rounded-sm" />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'executive',
                label: 'Executive',
                desc: 'Top nav bar, table-focused, dense professional layout',
                preview: (
                  <div className="flex flex-col gap-1 h-14 w-full">
                    <div className="h-2.5 bg-gray-700 rounded-sm" />
                    <div className="flex-1 flex flex-col gap-0.5 px-1">
                      <div className="h-1.5 bg-gray-700/40 rounded-sm" />
                      <div className="h-1.5 bg-gray-700/25 rounded-sm" />
                      <div className="h-1.5 bg-gray-700/40 rounded-sm" />
                      <div className="h-1.5 bg-gray-700/25 rounded-sm" />
                      <div className="h-1.5 bg-gray-700/40 rounded-sm" />
                    </div>
                  </div>
                ),
              },
              {
                id: 'minimal',
                label: 'Minimal',
                desc: 'Ultra-clean, maximum whitespace, slim navigation',
                preview: (
                  <div className="flex gap-1 h-14 w-full">
                    <div className="w-2.5 bg-gray-700/60 rounded-sm" />
                    <div className="flex-1 flex flex-col gap-2 py-1 px-1">
                      <div className="h-1 bg-gray-700/30 rounded-sm w-2/3" />
                      <div className="h-px bg-gray-700/20" />
                      <div className="h-1 bg-gray-700/30 rounded-sm w-1/2" />
                      <div className="h-px bg-gray-700/20" />
                      <div className="h-1 bg-gray-700/30 rounded-sm w-3/4" />
                    </div>
                  </div>
                ),
              },
              {
                id: 'classic',
                label: 'Classic',
                desc: 'Tab-based nav, high density, structured enterprise layout',
                preview: (
                  <div className="flex gap-1 h-14 w-full">
                    <div className="w-4 bg-gray-700/80 rounded-sm flex flex-col gap-0.5 p-0.5">
                      <div className="h-1 bg-gray-600 rounded-sm" />
                      <div className="h-1 bg-gray-600/50 rounded-sm" />
                      <div className="h-1 bg-gray-600/50 rounded-sm" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        <div className="h-2 flex-1 bg-gray-700/50 rounded-sm" />
                        <div className="h-2 flex-1 bg-gray-700/30 rounded-sm" />
                        <div className="h-2 flex-1 bg-gray-700/30 rounded-sm" />
                      </div>
                      <div className="flex-1 bg-gray-700/20 rounded-sm" />
                    </div>
                  </div>
                ),
              },
            ].map(({ id, label, desc, preview }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleLayoutThemeChange(id)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  layoutTheme === id
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="bg-gray-800 rounded p-2 mb-2.5">
                  {preview}
                </div>
                <p className={`text-sm font-medium mb-0.5 ${layoutTheme === id ? 'text-brand' : 'text-white'}`}>
                  {label}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* App Theme card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">App Theme</h2>
          <p className="text-xs text-gray-500 mb-4">
            Controls typography and visual aesthetic across the Dashboard and Client Portal.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'modern',
                label: 'Modern',
                desc: 'Clean & functional. Sans-serif UI, compact cards, sharp numerics.',
                preview: (
                  <div className="h-14 w-full flex flex-col gap-1.5 justify-center px-2">
                    <div className="h-2 bg-gray-600 rounded w-3/4" />
                    <div className="h-1.5 bg-gray-700/60 rounded w-1/2" />
                    <div className="h-1.5 bg-gray-700/40 rounded w-2/3" />
                  </div>
                ),
              },
              {
                id: 'luxury',
                label: 'Luxury',
                desc: 'Refined & elegant. Cormorant display headings, generous whitespace.',
                preview: (
                  <div className="h-14 w-full flex flex-col gap-2 justify-center px-2">
                    <div className="h-3 bg-gray-600 rounded w-2/3" />
                    <div className="h-1 bg-gray-700/40 rounded w-1/2" />
                    <div className="h-1 bg-gray-700/30 rounded w-3/4" />
                  </div>
                ),
              },
            ].map(({ id, label, desc, preview }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAppTheme(id)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  appTheme === id ? 'border-brand bg-brand/5' : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="bg-gray-800 rounded p-2 mb-2.5">{preview}</div>
                <p className={`text-sm font-medium mb-0.5 ${appTheme === id ? 'text-brand' : 'text-white'}`}>{label}</p>
                <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Session Timeouts card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Session Timeouts</h2>
          <p className="text-xs text-gray-500 mb-4">
            Automatically sign out inactive users after this many minutes. Set to 0 to disable.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Admin',   value: timeoutAdmin,   set: setTimeoutAdmin },
              { label: 'Manager', value: timeoutManager, set: setTimeoutManager },
              { label: 'Staff',   value: timeoutStaff,   set: setTimeoutStaff },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" min={0} max={1440} value={value}
                    onChange={e => set(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Visibility card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Widget Visibility</h2>
          <p className="text-xs text-gray-500 mb-4">
            Toggle off any Dashboard widgets you don't want staff to see. Disabled widgets won't render for any user in this organization.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DASHBOARD_WIDGETS.map(({ id, label }) => {
              const enabled = !disabledWidgets.includes(id)
              return (
                <label
                  key={id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-200">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => toggleWidget(id)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                      enabled ? 'bg-brand' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              )
            })}
          </div>
        </div>

        {/* Booking Experience card */}
        {(() => {
          const slug = org?.slug || ''
          const bookingUrl = slug
            ? `https://bridgewaybooking.com/${slug}`
            : null

          function Toggle({ checked, onChange }) {
            return (
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                  checked ? 'bg-brand' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  checked ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            )
          }

          return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-1">Booking Experience</h2>
              <p className="text-xs text-gray-500 mb-5">
                Customize the guest booking page your clients access from your website.
              </p>

              {/* Booking URL */}
              {bookingUrl && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Guest Booking URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={bookingUrl}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-gray-300 text-xs font-mono focus:outline-none select-all"
                      onClick={e => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(bookingUrl)
                        setBookingCopied(true)
                        setTimeout(() => setBookingCopied(false), 2000)
                      }}
                      className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      {bookingCopied ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">Paste this link on your website so clients can book without logging in.</p>
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <div>
                    <span className="text-sm text-gray-200">Show provider selection</span>
                    <p className="text-xs text-gray-500 mt-0.5">Let clients choose a specific staff member</p>
                  </div>
                  <Toggle checked={bookingShowProviders} onChange={setBookingShowProviders} />
                </label>
                <label className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <div>
                    <span className="text-sm text-gray-200">Require phone number</span>
                    <p className="text-xs text-gray-500 mt-0.5">Make phone mandatory on the guest info form</p>
                  </div>
                  <Toggle checked={bookingRequirePhone} onChange={setBookingRequirePhone} />
                </label>
              </div>

              {/* Text customization */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Welcome Message <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={bookingWelcomeText}
                    onChange={e => setBookingWelcomeText(e.target.value)}
                    placeholder="Welcome! We're excited to see you. Browse our services below."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  />
                  <p className="mt-1 text-xs text-gray-500">Shown at the top of the booking page above the service list.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Confirmation Message <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={bookingConfirmationText}
                    onChange={e => setBookingConfirmationText(e.target.value)}
                    placeholder="Your request has been received. We'll be in touch shortly to confirm."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  />
                  <p className="mt-1 text-xs text-gray-500">Shown on the success screen after a booking is submitted.</p>
                </div>
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}
