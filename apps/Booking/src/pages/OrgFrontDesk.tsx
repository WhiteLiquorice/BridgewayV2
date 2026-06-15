import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { getOrgAppointments, updateAppointmentStatus, createAppointment, getActiveServices, searchClients } from '@bridgeway/database'

// Constants for appointment status (ported from dashboard)
const STATUS_ORDER = ['pending', 'confirmed', 'arrived', 'with_provider', 'completed']

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  arrived: 'Arrived',
  with_provider: 'With Provider',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_STYLES = {
  pending:       'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  arrived:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  with_provider: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  completed:     'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:     'bg-red-500/10 text-red-400 border-red-500/20',
}

const NEXT_ACTION_LABELS = {
  pending:       'Confirm',
  confirmed:     'Check In',
  arrived:       'Start Visit',
  with_provider: 'Complete',
}

const NEXT_ACTION_STYLES = {
  pending:       'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  confirmed:     'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  arrived:       'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
  with_provider: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
}

function getNextStatus(current: string) {
  const idx = STATUS_ORDER.indexOf(current)
  if (idx === -1 || idx >= STATUS_ORDER.length - 1) return null
  return STATUS_ORDER[idx + 1]
}

function getStatusStyle(status: string) {
  return STATUS_STYLES[status as keyof typeof STATUS_STYLES] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

// CSV export helper
function downloadCSV(rows: any[], columns: string[], headers: Record<string, string> = {}, filename = 'export.csv') {
  if (!rows || rows.length === 0) return

  const headerRow = columns.map(c => quote(headers[c] || c))
  const dataRows = rows.map(row =>
    columns.map(c => {
      let val = row[c]
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        val = val.name || val.fullName || val.email || JSON.stringify(val)
      }
      return quote(val ?? '')
    })
  )

  const csv = [headerRow, ...dataRows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function quote(val: any) {
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

const PAGE_SIZE = 10

export default function OrgFrontDesk() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    fetchAppointments()
  }, [orgId, page, statusFilter, dateFrom, dateTo])

  async function fetchAppointments() {
    setLoading(true)
    try {
      const { data } = await getOrgAppointments(dataconnect, { orgId })
      let appts = data.appointments || []

      // Apply in-memory filters
      if (statusFilter) {
        appts = appts.filter(a => a.status === statusFilter)
      }
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime()
        appts = appts.filter(a => new Date(a.scheduledAt).getTime() >= fromTime)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        const toTime = toDate.getTime()
        appts = appts.filter(a => new Date(a.scheduledAt).getTime() <= toTime)
      }

      setTotal(appts.length)

      // Paginate
      const start = page * PAGE_SIZE
      const paginated = appts.slice(start, start + PAGE_SIZE)

      // Map fields to match Supabase structure:
      // clients(id, name), services(name), scheduled_at
      const mapped = paginated.map((appt: any) => ({
        ...appt,
        scheduled_at: appt.scheduledAt,
        client_id: appt.client?.id,
        clients: appt.client ? { id: appt.client.id, name: appt.client.name } : null,
        services: appt.service ? { name: appt.service.name } : null
      }))

      setAppointments(mapped)
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function advanceStatus(id: string, currentStatus: string) {
    const next = getNextStatus(currentStatus)
    if (!next) return
    setUpdating(id)
    try {
      await updateAppointmentStatus(dataconnect, { id, status: next })
      fetchAppointments()
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdating(null)
    }
  }

  async function cancelAppointment(id: string) {
    if (!window.confirm('Cancel this appointment?')) return
    setUpdating(id)
    try {
      await updateAppointmentStatus(dataconnect, { id, status: 'cancelled' })
      fetchAppointments()
    } catch (err) {
      console.error('Error cancelling appointment:', err)
    } finally {
      setUpdating(null)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasFilters = statusFilter || dateFrom || dateTo

  return (
    <div className="min-h-screen bg-[#0c1a2e] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#080f1d] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-[#080f1d]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Org Booking Front Desk</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{profile?.fullName} ({profile?.role})</span>
            <button
              onClick={() => signOut().then(() => navigate('/login'))}
              className="text-xs px-3 py-1.5 border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif">Front Desk Schedule</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} total appointments</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => downloadCSV(
                appointments.map(a => ({
                  client: a.clients?.name ?? '',
                  service: a.services?.name ?? '',
                  date: new Date(a.scheduled_at).toLocaleString(),
                  status: STATUS_LABELS[a.status as keyof typeof STATUS_LABELS] || a.status,
                  amount: Number(a.amount || 0).toFixed(2),
                })),
                ['client', 'service', 'date', 'status', 'amount'],
                { client: 'Client', service: 'Service', date: 'Date', status: 'Status', amount: 'Amount' },
                'appointments.csv'
              )}
              disabled={appointments.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-gray-400 border border-gray-800 rounded-xl hover:text-white hover:border-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-[#080f1d] text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</label>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
                className="px-3 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="arrived">Arrived</option>
                <option value="with_provider">With Provider</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setPage(0) }}
                className="px-3 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setPage(0) }}
                className="px-3 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
              />
            </div>

            {hasFilters && (
              <button
                onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(0) }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 rounded-xl transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-[#080f1d]/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map(appt => {
                    const nextStatus = getNextStatus(appt.status)
                    const isUpdating = updating === appt.id
                    return (
                      <tr key={appt.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-200">
                          {appt.clients?.name ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {appt.services?.name ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(appt.scheduled_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: 'numeric', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(appt.status)}`}>
                            {STATUS_LABELS[appt.status as keyof typeof STATUS_LABELS] || appt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-200 font-medium tabular-nums">
                          ${Number(appt.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {nextStatus && (
                              <button
                                onClick={() => advanceStatus(appt.id, appt.status)}
                                disabled={isUpdating}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors disabled:opacity-50 ${NEXT_ACTION_STYLES[appt.status as keyof typeof NEXT_ACTION_STYLES] || ''}`}
                              >
                                {isUpdating ? '...' : NEXT_ACTION_LABELS[appt.status as keyof typeof NEXT_ACTION_LABELS]}
                              </button>
                            )}
                            {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                              <button
                                onClick={() => cancelAppointment(appt.id)}
                                disabled={isUpdating}
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/80 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-800 bg-[#080f1d]/20 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Local Add Appointment Modal */}
      {isModalOpen && (
        <AddAppointmentModal
          orgId={orgId}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => { setIsModalOpen(false); fetchAppointments() }}
        />
      )}
    </div>
  )
}

// Sub-component AddAppointmentModal
function AddAppointmentModal({ orgId, onClose, onCreated }: { orgId: string; onClose: () => void; onCreated: () => void }) {
  const [clients, setClients] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const searchTimer = useRef<any>(null)

  useEffect(() => {
    // Fetch active services
    getActiveServices(dataconnect, { orgId })
      .then(({ data }) => setServices(data.services || []))
  }, [orgId])

  // Debounced search for clients
  useEffect(() => {
    clearTimeout(searchTimer.current)
    if (!clientSearch.trim()) { setClients([]); return }
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await searchClients(dataconnect, { orgId, query: clientSearch })
        setClients(data.clients || [])
        setShowDropdown(true)
      } catch (err) {
        console.error('Error searching clients:', err)
      }
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [clientSearch, orgId])

  function handleServiceChange(id: string) {
    setServiceId(id)
    const svc = services.find(s => s.id === id)
    if (svc) {
      setAmount(String(svc.price || ''))
    }
  }

  async function handleSave() {
    if (!selectedClient) { setError('Please select a client'); return }
    if (!date || !time) { setError('Please set date and time'); return }
    setSaving(true)
    setError('')
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      await createAppointment(dataconnect, {
        orgId,
        clientId: selectedClient.id,
        serviceId: serviceId || null,
        scheduledAt,
        status: 'confirmed',
        amount: amount ? parseFloat(amount) : 0,
        notes: notes || null,
      })
      onCreated()
    } catch (e: any) {
      setError(e.message || 'Failed to create appointment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold font-serif mb-5">New Appointment</h2>

        <div className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}

          {/* Client select */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Client *</label>
            {selectedClient ? (
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl">
                <span className="text-sm">{selectedClient.name}</span>
                <button onClick={() => { setSelectedClient(null); setClientSearch('') }} className="text-amber-500 text-xs font-semibold">
                  Change
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                onFocus={() => clients.length > 0 && setShowDropdown(true)}
                placeholder="Search clients..."
                className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50"
              />
            )}
            {showDropdown && clients.length > 0 && !selectedClient && (
              <div className="absolute z-10 mt-1 w-full bg-[#0c1a2e] border border-gray-800 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {clients.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedClient(c); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-850 hover:text-amber-400 transition-colors"
                  >
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service select */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Service</label>
            <select
              value={serviceId}
              onChange={e => handleServiceChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50"
            >
              <option value="">Select service...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Time *</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes..."
              className="w-full px-3.5 py-2 bg-[#0c1a2e] border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-850 hover:border-gray-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#080f1d] rounded-xl text-sm font-bold shadow-lg shadow-amber-500/10 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
