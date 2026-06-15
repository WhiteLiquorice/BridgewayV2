import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function StatusBadge({ status }: { status: string }) {
  const styles = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    completed: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }
  const labels = {
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending:   'Pending',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function ClientDashboard() {
  const { profile, org, signOut } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelMsg, setCancelMsg] = useState<{ type: string; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  useEffect(() => {
    if (!profile) return
    fetchData()
  }, [profile])

  async function fetchData() {
    setLoading(true)
    try {
      // 1. Resolve client record in Supabase
      const { data: clientRecord } = await supabase
        .from('clients')
        .select('id')
        .eq('org_id', profile.org_id)
        .eq('email', profile.email)
        .maybeSingle()

      const clientId = clientRecord?.id || profile.id

      // 2. Fetch appointments
      const { data: appts } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .eq('client_id', clientId)
        .order('scheduled_at', { ascending: false })

      setAppointments(appts || [])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dt: string) {
    return new Date(dt).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  function canCancel(appt: any) {
    if (appt.status !== 'confirmed' && appt.status !== 'pending') return false
    const hoursUntil = (new Date(appt.scheduled_at).getTime() - new Date().getTime()) / 3600000
    return hoursUntil > 18 // 18 hour cancellation window default
  }

  async function handleCancel(appt: any) {
    if (!window.confirm(`Are you sure you want to cancel your appointment?`)) return
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appt.id)

      if (error) throw error
      setCancelMsg({ type: 'success', text: 'Appointment cancelled successfully.' })
      fetchData()
    } catch (err: any) {
      setCancelMsg({ type: 'error', text: err.message || 'Failed to cancel appointment.' })
    }
    setTimeout(() => setCancelMsg(null), 4000)
  }

  const now = new Date()
  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.scheduled_at)
    if (activeTab === 'upcoming') {
      return appt.status !== 'cancelled' && apptDate >= now
    }
    if (activeTab === 'past') {
      return appt.status === 'completed' || apptDate < now || appt.status === 'cancelled'
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#0c1a2e] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#080f1d] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-[#080f1d]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Bridgeway Booking Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{profile?.fullName || profile?.email}</span>
            <button
              onClick={() => signOut().then(() => navigate('/login'))}
              className="text-xs px-3 py-1.5 border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">My Appointments</h1>
            <p className="text-gray-400 text-sm mt-1">View, manage, and book appointments with {org?.name || 'your provider'}.</p>
          </div>

          {org?.slug && (
            <Link
              to={`/${org.slug}`}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-[#080f1d] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-colors self-start md:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Book New Appointment
            </Link>
          )}
        </div>

        {cancelMsg && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${cancelMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {cancelMsg.text}
          </div>
        )}

        {/* Tab filters */}
        <div className="flex gap-4 border-b border-gray-800 mb-8">
          {(['upcoming', 'past', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative capitalize ${activeTab === tab ? 'text-amber-500' : 'text-gray-400 hover:text-white'}`}
            >
              {tab} Appointments
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-16 text-center text-gray-500">
            <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm font-medium text-gray-400">No appointments found</p>
            <p className="text-xs text-gray-600 mt-1">There are no appointments listed under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map((appt) => (
              <div key={appt.id} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-semibold">{appt.services?.name || 'Appointment'}</h3>
                      <StatusBadge status={appt.status} />
                    </div>
                    <p className="text-sm text-amber-500 font-medium">{formatDate(appt.scheduled_at)}</p>
                    {appt.notes && <p className="text-xs text-gray-400 italic">Notes: {appt.notes}</p>}
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    {appt.amount > 0 && (
                      <span className="font-serif text-lg font-medium text-gray-200">
                        ${Number(appt.amount).toFixed(2)}
                      </span>
                    )}

                    {canCancel(appt) && (
                      <button
                        onClick={() => handleCancel(appt)}
                        className="px-3.5 py-2 text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
