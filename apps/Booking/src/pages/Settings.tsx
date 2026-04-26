import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db, getGoogleOAuthUrl, disconnectGoogleCalendar } from '../lib/firebase'

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="mb-5">
        <h2 className="text-white font-semibold text-base">{title}</h2>
        {description && <p className="text-gray-400 text-sm mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder = '', min = undefined, max = undefined }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
      />
    </div>
  )
}

function SaveButton({ saving, saved, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#080f1d] font-semibold rounded-lg px-5 py-2 text-sm transition-colors flex items-center gap-2"
    >
      {saving ? (
        <><span className="w-3.5 h-3.5 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />Saving…</>
      ) : saved ? (
        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Saved</>
      ) : 'Save Changes'}
    </button>
  )
}

export default function Settings() {
  const { user, orgConfig } = useAuth()

  // Profile / hours form
  const [profileForm, setProfileForm] = useState({
    name: '', description: '', email: '', phone: '', primaryColor: '#f59e0b',
  })
  const [hoursForm, setHoursForm] = useState({
    hoursStart: '09:00', hoursEnd: '17:00',
    bookingLeadTimeHours: 2, cancellationWindowHours: 18,
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile]   = useState(false)
  const [savingHours, setSavingHours]     = useState(false)
  const [savedHours, setSavedHours]       = useState(false)

  // Services
  const [services, setServices]         = useState<any[]>([])
  const [newService, setNewService]     = useState({ name: '', durationMinutes: 60, price: '' })
  const [addingService, setAddingService] = useState(false)
  const [confirmDeleteService, setConfirmDeleteService] = useState<string | null>(null)

  // Blocked dates
  const [blockedDates, setBlockedDates] = useState<any[]>([])
  const [newBlocked, setNewBlocked]     = useState({ date: '', reason: '' })
  const [addingBlocked, setAddingBlocked] = useState(false)

  // Google Calendar
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [connectingCalendar, setConnectingCalendar] = useState(false)
  const [disconnectingCalendar, setDisconnectingCalendar] = useState(false)

  // Load org config into forms on mount
  useEffect(() => {
    if (!orgConfig) return
    setProfileForm({
      name: orgConfig.name || '',
      description: orgConfig.description || '',
      email: (orgConfig as any).email || '',
      phone: (orgConfig as any).phone || '',
      primaryColor: orgConfig.primaryColor || '#f59e0b',
    })
    setHoursForm({
      hoursStart: orgConfig.hoursStart || '09:00',
      hoursEnd: orgConfig.hoursEnd || '17:00',
      bookingLeadTimeHours: orgConfig.bookingLeadTimeHours ?? 2,
      cancellationWindowHours: orgConfig.cancellationWindowHours ?? 18,
    })
    setServices(orgConfig.services || [])
    setBlockedDates(orgConfig.blockedDates || [])
    setCalendarConnected(orgConfig.googleCalendarConnected || false)
  }, [orgConfig])

  async function saveProfile() {
    if (!user) return
    setSavingProfile(true)
    await setDoc(doc(db, 'bookingOrgs', user.uid), profileForm, { merge: true })
    setSavingProfile(false)
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2000)
  }

  async function saveHours() {
    if (!user) return
    setSavingHours(true)
    await setDoc(doc(db, 'bookingOrgs', user.uid), hoursForm, { merge: true })
    setSavingHours(false)
    setSavedHours(true)
    setTimeout(() => setSavedHours(false), 2000)
  }

  async function handleAddService(e) {
    e.preventDefault()
    if (!user || !newService.name.trim()) return
    setAddingService(true)
    const svc = {
      id: crypto.randomUUID(),
      name: newService.name.trim(),
      durationMinutes: Number(newService.durationMinutes) || 60,
      price: Number(newService.price) || 0,
      active: true,
    }
    await updateDoc(doc(db, 'bookingOrgs', user.uid), { services: arrayUnion(svc) })
    setServices(prev => [...prev, svc])
    setNewService({ name: '', durationMinutes: 60, price: '' })
    setAddingService(false)
  }

  async function handleToggleActive(svc) {
    if (!user) return
    const updated = { ...svc, active: !svc.active }
    const next = services.map(s => s.id === svc.id ? updated : s)
    setServices(next)
    await setDoc(doc(db, 'bookingOrgs', user.uid), { services: next }, { merge: true })
  }

  async function handleDeleteService(svc) {
    if (!user) return
    await updateDoc(doc(db, 'bookingOrgs', user.uid), { services: arrayRemove(svc) })
    setServices(prev => prev.filter(s => s.id !== svc.id))
    setConfirmDeleteService(null)
  }

  async function handleAddBlockedDate(e) {
    e.preventDefault()
    if (!user || !newBlocked.date) return
    setAddingBlocked(true)
    const bd = { id: crypto.randomUUID(), date: newBlocked.date, reason: newBlocked.reason.trim() || null }
    await updateDoc(doc(db, 'bookingOrgs', user.uid), { blockedDates: arrayUnion(bd) })
    setBlockedDates(prev => [...prev, bd])
    setNewBlocked({ date: '', reason: '' })
    setAddingBlocked(false)
  }

  async function handleDeleteBlockedDate(bd) {
    if (!user) return
    await updateDoc(doc(db, 'bookingOrgs', user.uid), { blockedDates: arrayRemove(bd) })
    setBlockedDates(prev => prev.filter(b => b.id !== bd.id))
  }

  async function handleConnectCalendar() {
    if (!user) return
    setConnectingCalendar(true)
    try {
      const redirectUri = `${window.location.origin}/admin/oauth/google`
      const result = await getGoogleOAuthUrl({ orgId: user.uid, redirectUri })
      // Redirect user to Google's consent screen
      window.location.href = result.data.url
    } catch (err) {
      console.error('Failed to get OAuth URL', err)
      setConnectingCalendar(false)
    }
  }

  async function handleDisconnectCalendar() {
    if (!user) return
    setDisconnectingCalendar(true)
    try {
      await disconnectGoogleCalendar({ orgId: user.uid })
      setCalendarConnected(false)
    } catch (err) {
      console.error('Failed to disconnect calendar', err)
    }
    setDisconnectingCalendar(false)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your business profile and booking configuration</p>
      </div>

      {/* Business Info */}
      <SectionCard title="Business Info" description="Your business details shown on the public booking page">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InputField label="Business Name" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} placeholder="Wellness Co" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
            <textarea
              value={profileForm.description}
              onChange={e => setProfileForm(f => ({ ...f, description: e.target.value }))}
              placeholder="A short description of your business…"
              rows={3}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>
          <InputField label="Email" type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} placeholder="hello@yourbusiness.com" />
          <InputField label="Phone" type="tel" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" />
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={profileForm.primaryColor} onChange={e => setProfileForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-gray-700 bg-[#0c1a2e] cursor-pointer p-1" />
              <span className="text-sm text-gray-400 font-mono">{profileForm.primaryColor}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton saving={savingProfile} saved={savedProfile} onClick={saveProfile} />
        </div>
      </SectionCard>

      {/* Hours & Booking */}
      <SectionCard title="Hours & Booking" description="Configure your availability and booking policies">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Opening Time" type="time" value={hoursForm.hoursStart} onChange={e => setHoursForm(f => ({ ...f, hoursStart: e.target.value }))} />
          <InputField label="Closing Time" type="time" value={hoursForm.hoursEnd} onChange={e => setHoursForm(f => ({ ...f, hoursEnd: e.target.value }))} />
          <div>
            <InputField label="Lead Time (hours)" type="number" value={hoursForm.bookingLeadTimeHours} onChange={e => setHoursForm(f => ({ ...f, bookingLeadTimeHours: Number(e.target.value) }))} placeholder="2" min={0} max={168} />
            <p className="text-gray-500 text-xs mt-1">Minimum hours before a booking can be made</p>
          </div>
          <div>
            <InputField label="Cancellation Window (hours)" type="number" value={hoursForm.cancellationWindowHours} onChange={e => setHoursForm(f => ({ ...f, cancellationWindowHours: Number(e.target.value) }))} placeholder="18" min={0} max={720} />
            <p className="text-gray-500 text-xs mt-1">Hours before appointment when cancellation is allowed</p>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton saving={savingHours} saved={savedHours} onClick={saveHours} />
        </div>
      </SectionCard>

      {/* Services */}
      <SectionCard title="Services" description="Manage the services clients can book">
        <div className="space-y-2 mb-5">
          {services.length === 0 && <p className="text-gray-500 text-sm">No services yet. Add one below.</p>}
          {services.map(svc => (
            <div key={svc.id} className="flex items-center gap-4 bg-[#0c1a2e] border border-gray-700 rounded-lg px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${svc.active ? 'text-white' : 'text-gray-500 line-through'}`}>{svc.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{svc.durationMinutes} min · ${Number(svc.price).toFixed(2)}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => handleToggleActive(svc)}>
                <div className="relative">
                  <div className={`w-8 h-4 rounded-full transition-colors ${svc.active ? 'bg-amber-500' : 'bg-gray-700'}`} />
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${svc.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-gray-400">{svc.active ? 'Active' : 'Off'}</span>
              </label>
              {confirmDeleteService === svc.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">Delete?</span>
                  <button onClick={() => handleDeleteService(svc)} className="px-2 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors">Yes</button>
                  <button onClick={() => setConfirmDeleteService(null)} className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors">No</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDeleteService(svc.id)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddService} className="border-t border-gray-800 pt-5">
          <p className="text-sm font-medium text-gray-400 mb-3">Add New Service</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <input type="text" value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} placeholder="Service name" required className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
              <input type="number" value={newService.durationMinutes} onChange={e => setNewService(s => ({ ...s, durationMinutes: Number(e.target.value) }))} min={5} max={480} required className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              <input type="number" value={newService.price} onChange={e => setNewService(s => ({ ...s, price: e.target.value }))} min={0} step="0.01" placeholder="0.00" className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={addingService || !newService.name.trim()} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1d] font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2">
                {addingService ? <span className="w-4 h-4 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" /> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</>}
              </button>
            </div>
          </div>
        </form>
      </SectionCard>

      {/* Blocked Dates */}
      <SectionCard title="Blocked Dates" description="Mark dates when you're unavailable for bookings">
        <div className="space-y-2 mb-5">
          {blockedDates.length === 0 && <p className="text-gray-500 text-sm">No blocked dates. Add one below.</p>}
          {blockedDates.map(bd => {
            const [year, month, day] = bd.date.split('-').map(Number)
            const display = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
            return (
              <div key={bd.id} className="flex items-center gap-4 bg-[#0c1a2e] border border-gray-700 rounded-lg px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{display}</p>
                  {bd.reason && <p className="text-gray-500 text-xs mt-0.5">{bd.reason}</p>}
                </div>
                <button onClick={() => handleDeleteBlockedDate(bd)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )
          })}
        </div>
        <form onSubmit={handleAddBlockedDate} className="border-t border-gray-800 pt-5">
          <p className="text-sm font-medium text-gray-400 mb-3">Block a Date</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" value={newBlocked.date} min={todayStr} onChange={e => setNewBlocked(b => ({ ...b, date: e.target.value }))} required className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Reason (optional)</label>
              <input type="text" value={newBlocked.reason} onChange={e => setNewBlocked(b => ({ ...b, reason: e.target.value }))} placeholder="Holiday, vacation…" className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={addingBlocked || !newBlocked.date} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1d] font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2">
                {addingBlocked ? <span className="w-4 h-4 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" /> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Block Date</>}
              </button>
            </div>
          </div>
        </form>
      </SectionCard>

      {/* Google Calendar */}
      <SectionCard title="Google Calendar" description="Sync your bookings with your personal or professional Google Calendar">
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white">Google Calendar Sync</p>
                {calendarConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {calendarConnected
                  ? 'Your Google Calendar is connected. Confirmed bookings will automatically appear in your calendar, and existing events will block available slots.'
                  : 'Connect your Google Calendar to automatically block busy times and push confirmed bookings as calendar events.'}
              </p>
              <div className="mt-4 flex items-center gap-3">
                {calendarConnected ? (
                  <button
                    onClick={handleDisconnectCalendar}
                    disabled={disconnectingCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors disabled:opacity-50"
                  >
                    {disconnectingCalendar ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : null}
                    Disconnect Calendar
                  </button>
                ) : (
                  <button
                    onClick={handleConnectCalendar}
                    disabled={connectingCalendar}
                    className="flex items-center gap-2.5 px-4 py-2 bg-white text-[#0c1a2e] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {connectingCalendar
                      ? <span className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                      : <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />}
                    {connectingCalendar ? 'Redirecting…' : 'Connect Google Calendar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
