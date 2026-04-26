import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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

function InputField({ label, type = 'text', value, onChange, placeholder, min, max }) {
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

export default function Settings() {
  const { user } = useAuth()

  // Profile state
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    business_name: '', description: '', email: '', phone: '',
  })
  const [hoursForm, setHoursForm] = useState({
    hours_start: '09:00', hours_end: '17:00',
    booking_lead_time_hours: 2, cancellation_pickup_window_hours: 18,
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [savingHours, setSavingHours] = useState(false)
  const [savedHours, setSavedHours] = useState(false)

  // Services state
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [newService, setNewService] = useState({ name: '', duration_minutes: 60, price: '' })
  const [addingService, setAddingService] = useState(false)
  const [confirmDeleteService, setConfirmDeleteService] = useState(null)
  const [deletingService, setDeletingService] = useState(null)

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState([])
  const [loadingBlocked, setLoadingBlocked] = useState(true)
  const [newBlocked, setNewBlocked] = useState({ date: '', reason: '' })
  const [addingBlocked, setAddingBlocked] = useState(false)
  const [deletingBlocked, setDeletingBlocked] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (data) {
      setProfile(data)
      setProfileForm({
        business_name: data.business_name || '',
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
      })
      setHoursForm({
        hours_start: data.hours_start || '09:00',
        hours_end: data.hours_end || '17:00',
        booking_lead_time_hours: data.booking_lead_time_hours ?? 2,
        cancellation_pickup_window_hours: data.cancellation_pickup_window_hours ?? 18,
      })
    }
  }, [user])

  const fetchServices = useCallback(async () => {
    if (!user) return
    setLoadingServices(true)
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setServices(data || [])
    setLoadingServices(false)
  }, [user])

  const fetchBlockedDates = useCallback(async () => {
    if (!user) return
    setLoadingBlocked(true)
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
    setBlockedDates(data || [])
    setLoadingBlocked(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
    fetchServices()
    fetchBlockedDates()
  }, [fetchProfile, fetchServices, fetchBlockedDates])

  async function saveProfile() {
    setSavingProfile(true)
    if (profile) {
      await supabase.from('profiles').update(profileForm).eq('id', profile.id)
    } else {
      await supabase.from('profiles').insert({ ...profileForm, user_id: user.id })
    }
    await fetchProfile()
    setSavingProfile(false)
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2000)
  }

  async function saveHours() {
    setSavingHours(true)
    if (profile) {
      await supabase.from('profiles').update(hoursForm).eq('id', profile.id)
    } else {
      await supabase.from('profiles').insert({ ...hoursForm, user_id: user.id })
    }
    await fetchProfile()
    setSavingHours(false)
    setSavedHours(true)
    setTimeout(() => setSavedHours(false), 2000)
  }

  async function handleAddService(e) {
    e.preventDefault()
    if (!newService.name.trim()) return
    setAddingService(true)
    await supabase.from('services').insert({
      user_id: user.id,
      name: newService.name.trim(),
      duration_minutes: Number(newService.duration_minutes) || 60,
      price: Number(newService.price) || 0,
      active: true,
    })
    setNewService({ name: '', duration_minutes: 60, price: '' })
    await fetchServices()
    setAddingService(false)
  }

  async function handleToggleActive(service) {
    await supabase
      .from('services')
      .update({ active: !service.active })
      .eq('id', service.id)
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, active: !s.active } : s))
  }

  async function handleDeleteService(serviceId) {
    setDeletingService(serviceId)
    await supabase.from('services').delete().eq('id', serviceId)
    setConfirmDeleteService(null)
    await fetchServices()
    setDeletingService(null)
  }

  async function handleAddBlockedDate(e) {
    e.preventDefault()
    if (!newBlocked.date) return
    setAddingBlocked(true)
    await supabase.from('blocked_dates').insert({
      user_id: user.id,
      date: newBlocked.date,
      reason: newBlocked.reason.trim() || null,
    })
    setNewBlocked({ date: '', reason: '' })
    await fetchBlockedDates()
    setAddingBlocked(false)
  }

  async function handleDeleteBlockedDate(id) {
    setDeletingBlocked(id)
    await supabase.from('blocked_dates').delete().eq('id', id)
    await fetchBlockedDates()
    setDeletingBlocked(null)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your business profile and booking configuration</p>
      </div>

      {/* Section 1: Business Info */}
      <SectionCard title="Business Info" description="Your business details shown on the public booking page">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InputField
              label="Business Name"
              value={profileForm.business_name}
              onChange={e => setProfileForm(f => ({ ...f, business_name: e.target.value }))}
              placeholder="Wellness Co"
            />
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
          <InputField
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
            placeholder="hello@yourbusiness.com"
          />
          <InputField
            label="Phone"
            type="tel"
            value={profileForm.phone}
            onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="(555) 000-0000"
          />
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#080f1d] font-semibold rounded-lg px-5 py-2 text-sm transition-colors flex items-center gap-2"
          >
            {savingProfile ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : savedProfile ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </SectionCard>

      {/* Section 2: Hours & Booking */}
      <SectionCard title="Hours & Booking" description="Configure your availability and booking policies">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Opening Time"
            type="time"
            value={hoursForm.hours_start}
            onChange={e => setHoursForm(f => ({ ...f, hours_start: e.target.value }))}
          />
          <InputField
            label="Closing Time"
            type="time"
            value={hoursForm.hours_end}
            onChange={e => setHoursForm(f => ({ ...f, hours_end: e.target.value }))}
          />
          <div>
            <InputField
              label="Lead Time (hours)"
              type="number"
              value={hoursForm.booking_lead_time_hours}
              onChange={e => setHoursForm(f => ({ ...f, booking_lead_time_hours: Number(e.target.value) }))}
              placeholder="2"
              min={0}
              max={168}
            />
            <p className="text-gray-500 text-xs mt-1">Minimum hours before a booking can be made</p>
          </div>
          <div>
            <InputField
              label="Cancellation Window (hours)"
              type="number"
              value={hoursForm.cancellation_pickup_window_hours}
              onChange={e => setHoursForm(f => ({ ...f, cancellation_pickup_window_hours: Number(e.target.value) }))}
              placeholder="18"
              min={0}
              max={720}
            />
            <p className="text-gray-500 text-xs mt-1">Hours before appointment when cancellation is allowed</p>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={saveHours}
            disabled={savingHours}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#080f1d] font-semibold rounded-lg px-5 py-2 text-sm transition-colors flex items-center gap-2"
          >
            {savingHours ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : savedHours ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </SectionCard>

      {/* Section 3: Services */}
      <SectionCard title="Services" description="Manage the services clients can book">
        {loadingServices ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            {services.length === 0 && (
              <p className="text-gray-500 text-sm">No services yet. Add one below.</p>
            )}
            {services.map(service => (
              <div
                key={service.id}
                className="flex items-center gap-4 bg-[#0c1a2e] border border-gray-700 rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${service.active ? 'text-white' : 'text-gray-500 line-through'}`}>
                    {service.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {service.duration_minutes} min · ${Number(service.price).toFixed(2)}
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={service.active}
                      onChange={() => handleToggleActive(service)}
                      className="sr-only"
                    />
                    <div className={`w-8 h-4 rounded-full transition-colors ${service.active ? 'bg-amber-500' : 'bg-gray-700'}`} />
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${service.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs text-gray-400">{service.active ? 'Active' : 'Off'}</span>
                </label>

                {confirmDeleteService === service.id ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">Delete?</span>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deletingService === service.id}
                      className="px-2 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                    >
                      {deletingService === service.id ? '…' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteService(null)}
                      className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteService(service.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new service */}
        <form onSubmit={handleAddService} className="border-t border-gray-800 pt-5">
          <p className="text-sm font-medium text-gray-400 mb-3">Add New Service</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                value={newService.name}
                onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
                placeholder="Service name"
                required
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
              <input
                type="number"
                value={newService.duration_minutes}
                onChange={e => setNewService(s => ({ ...s, duration_minutes: e.target.value }))}
                min={5}
                max={480}
                required
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              <input
                type="number"
                value={newService.price}
                onChange={e => setNewService(s => ({ ...s, price: e.target.value }))}
                min={0}
                step="0.01"
                placeholder="0.00"
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingService || !newService.name.trim()}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1d] font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {addingService ? (
                  <span className="w-4 h-4 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </SectionCard>

      {/* Section 4: Blocked Dates */}
      <SectionCard title="Blocked Dates" description="Mark dates when you're unavailable for bookings">
        {loadingBlocked ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            {blockedDates.length === 0 && (
              <p className="text-gray-500 text-sm">No blocked dates. Add one below.</p>
            )}
            {blockedDates.map(bd => {
              const [year, month, day] = bd.date.split('-').map(Number)
              const dateDisplay = new Date(year, month - 1, day).toLocaleDateString('en-US', {
                weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
              })
              return (
                <div
                  key={bd.id}
                  className="flex items-center gap-4 bg-[#0c1a2e] border border-gray-700 rounded-lg px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{dateDisplay}</p>
                    {bd.reason && <p className="text-gray-500 text-xs mt-0.5">{bd.reason}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDate(bd.id)}
                    disabled={deletingBlocked === bd.id}
                    className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    {deletingBlocked === bd.id ? (
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add blocked date form */}
        <form onSubmit={handleAddBlockedDate} className="border-t border-gray-800 pt-5">
          <p className="text-sm font-medium text-gray-400 mb-3">Block a Date</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input
                type="date"
                value={newBlocked.date}
                min={todayStr}
                onChange={e => setNewBlocked(b => ({ ...b, date: e.target.value }))}
                required
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Reason (optional)</label>
              <input
                type="text"
                value={newBlocked.reason}
                onChange={e => setNewBlocked(b => ({ ...b, reason: e.target.value }))}
                placeholder="Holiday, vacation…"
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingBlocked || !newBlocked.date}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1d] font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {addingBlocked ? (
                  <span className="w-4 h-4 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Block Date
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </SectionCard>

      {/* Section 5: Standalone & Calendar Sync */}
      <SectionCard title="Standalone Mode & Calendar Sync" description="Connect your booking app to external calendars">
        <div className="space-y-6">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Google Calendar Sync</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Automatically check for conflicts against your personal or professional Google Calendar. 
                  When connected, slots booked on your external calendar will be automatically blocked in Bridgeway.
                </p>
                <button className="mt-4 flex items-center gap-2.5 px-4 py-2 bg-white text-[#0c1a2e] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                  Connect Google Calendar
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" />
                <div className="w-10 h-5 bg-gray-800 border border-gray-700 rounded-full transition-colors group-hover:border-gray-600" />
                <div className="absolute top-1 left-1 w-3 h-3 bg-gray-500 rounded-full transition-transform" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Standalone Mode</p>
                <p className="text-xs text-gray-500 mt-0.5">Allow this booking engine to operate without the Bridgeway Command Center.</p>
              </div>
            </label>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
