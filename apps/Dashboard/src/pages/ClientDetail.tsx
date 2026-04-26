import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useTerminology } from '../context/TerminologyContext'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, getStatusStyle, getNextStatus, NEXT_ACTION_LABELS, NEXT_ACTION_STYLES } from '../lib/appointmentStatus'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'

export default function ClientDetail() {
  const { id }         = useParams()
  const { profile }    = useAuth()
  const { terms }      = useTerminology()
  const navigate       = useNavigate()
  const { showToast }  = useToast()
  const [updating,     setUpdating]     = useState(null)
  const [viewMode,     setViewMode]     = useState('timeline') // 'timeline' | 'table'
  const [showAddPkg,   setShowAddPkg]   = useState(false)
  const [pkgForm,      setPkgForm]      = useState({ name: '', total_sessions: 10, price: '', expires_at: '' })
  const [savingPkg,    setSavingPkg]    = useState(false)
  const [pkgTemplates, setPkgTemplates] = useState([])
  const [selectedTpl,  setSelectedTpl]  = useState('')
  // Local appointments state so status updates are reflected immediately
  const [localAppointments, setLocalAppointments] = useState(null)
  // Portal invite
  const [inviting,   setInviting]   = useState(false)
  const [inviteMsg,  setInviteMsg]  = useState(null) // { type: 'success'|'error', text: string }

  const orgId = profile?.org_id

  const { data: clientData, isLoading, refetch: refetchClient } = useQuery({
    queryKey: ['client-detail', id, orgId],
    queryFn: async () => {
      const [clientRes, apptRes, pkgRes, classRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', id).eq('org_id', orgId).maybeSingle(),
        supabase.from('appointments').select('id, scheduled_at, status, amount, notes, duration_minutes, services(name)')
          .eq('client_id', id).eq('org_id', orgId).order('scheduled_at', { ascending: false }),
        supabase.from('client_packages').select('*').eq('client_id', id).eq('org_id', orgId)
          .order('created_at', { ascending: false }),
        supabase.from('class_registrations').select('*, class:classes!class_id(name, start_time, day_of_week)')
          .eq('client_id', id).eq('org_id', orgId).order('class_date', { ascending: false }),
      ])
      if (clientRes.error) throw clientRes.error
      return {
        client: clientRes.data,
        appointments: apptRes.data || [],
        packages: pkgRes.data || [],
        classHistory: classRes.data || [],
      }
    },
    enabled: !!orgId && !!id,
  })

  // Load package templates separately (not part of main query)
  useEffect(() => {
    if (!orgId) return
    supabase.from('package_templates').select('*')
      .eq('org_id', orgId).eq('is_active', true).order('name')
      .then(({ data }) => setPkgTemplates(data || []))
  }, [orgId])

  // Sync localAppointments from query data (reset on fresh fetch)
  useEffect(() => {
    if (clientData?.appointments) {
      setLocalAppointments(clientData.appointments)
    }
  }, [clientData?.appointments])

  const client      = clientData?.client ?? null
  const appointments = localAppointments ?? clientData?.appointments ?? []
  const packages    = clientData?.packages ?? []
  const classHistory = clientData?.classHistory ?? []
  const loading     = isLoading

  function handleTemplateSelect(tplId) {
    setSelectedTpl(tplId)
    const tpl = pkgTemplates.find(t => t.id === tplId)
    if (tpl) {
      const purchaseDate = new Date().toISOString().split('T')[0]
      let expiresAt = ''
      if (tpl.expiry_days) {
        const exp = new Date()
        exp.setDate(exp.getDate() + tpl.expiry_days)
        expiresAt = exp.toISOString().split('T')[0]
      }
      setPkgForm({
        name: tpl.name,
        total_sessions: tpl.session_count || 1,
        price: String(tpl.price),
        expires_at: expiresAt,
      })
    }
  }

  async function addPackage(e) {
    e.preventDefault()
    setSavingPkg(true)
    try {
      const { error } = await supabase.from('client_packages').insert({
        org_id: profile.org_id,
        client_id: id,
        name: pkgForm.name.trim(),
        total_sessions: parseInt(pkgForm.total_sessions),
        price: pkgForm.price ? parseFloat(pkgForm.price) : 0,
        expires_at: pkgForm.expires_at || null,
      })
      if (error) throw error
      showToast('Package added', 'success')
      setShowAddPkg(false)
      setPkgForm({ name: '', total_sessions: 10, price: '', expires_at: '' })
      refetchClient()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSavingPkg(false)
    }
  }

  async function advanceStatus(apptId, currentStatus) {
    const next = getNextStatus(currentStatus)
    if (!next) return
    setUpdating(apptId)
    try {
      await supabase.from('appointments').update({ status: next }).eq('id', apptId)
      setLocalAppointments(prev => (prev ?? []).map(a => a.id === apptId ? { ...a, status: next } : a))
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  async function cancelAppointment(apptId) {
    setUpdating(apptId)
    try {
      await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', apptId)
      setLocalAppointments(prev => (prev ?? []).map(a => a.id === apptId ? { ...a, status: 'cancelled' } : a))
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <p className="text-gray-400">{terms.client.singular} not found.</p>
        <button onClick={() => navigate('/clients')} className="mt-4 text-sm text-brand hover:text-brand">
          ← Back to {terms.client.plural.toLowerCase()}
        </button>
      </div>
    )
  }

  const nonCancelled = appointments.filter(a => a.status !== 'cancelled')
  const totalSpent   = nonCancelled.reduce((s, a) => s + Number(a.amount || 0), 0)
  const totalAppts   = nonCancelled.length
  const avgPerVisit  = totalAppts > 0 ? totalSpent / totalAppts : 0
  const lastVisit    = nonCancelled.find(a => a.status === 'completed')
  const daysSinceLast = lastVisit
    ? Math.floor((Date.now() - new Date(lastVisit.scheduled_at).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Initials: first letter of first and last name
  const nameParts = client.name.split(' ')
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : client.name.charAt(0).toUpperCase()

  // Portal invite handler — calls the invite-to-portal Edge Function
  async function handleInvite() {
    if (!client.email) return
    if (!window.confirm(`Send a portal invite to ${client.email}?`)) return
    setInviting(true)
    setInviteMsg(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await supabase.functions.invoke('invite-to-portal', {
        body: {
          email: client.email,
          clientName: client.name,
          portalUrl: `${window.location.origin.replace(':5173', ':5176')}/portal/profile`,
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (res.error) throw res.error
      const body = res.data
      if (body?.error) throw new Error(body.error)
      setInviteMsg({ type: 'success', text: body?.note || `Invite sent to ${client.email}.` })
    } catch (err) {
      setInviteMsg({ type: 'error', text: err.message || 'Failed to send invite.' })
    } finally {
      setInviting(false)
      setTimeout(() => setInviteMsg(null), 6000)
    }
  }

  // Group appointments by month for timeline
  const grouped = {}
  appointments.forEach(a => {
    const key = new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(a)
  })

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {terms.client.plural.toLowerCase()}
      </button>

      {/* Client profile card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-brand">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-semibold text-white">{client.name}</h1>
              {/* Invite to Portal — visible to admin/manager/staff when client has an email */}
              {client.email && ['admin', 'manager', 'staff'].includes(profile?.role) && (
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {inviting ? 'Sending…' : 'Invite to Portal'}
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {client.email && (
                <a href={`mailto:${client.email}`} className="text-sm text-brand hover:text-brand transition-colors">
                  {client.email}
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {client.phone}
                </a>
              )}
              <span className="text-sm text-gray-500">
                Client since {new Date(client.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            {(client.date_of_birth || client.address) && (
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                {client.date_of_birth && (
                  <span className="text-sm text-gray-500">
                    DOB: {new Date(client.date_of_birth + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {client.address && (
                  <span className="text-sm text-gray-500">{client.address}</span>
                )}
              </div>
            )}
            {client.notes && (
              <div className="mt-3 p-3 rounded-lg bg-gray-800/50 text-sm text-gray-400 italic">{client.notes}</div>
            )}
          </div>
        </div>

        {/* Stats row — visits and last visit only */}
        <div className="mt-5 pt-5 border-t border-gray-800 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total visits</p>
            <p className="mt-1 text-2xl font-bold text-white">{totalAppts}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last visit</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {daysSinceLast !== null ? `${daysSinceLast}d ago` : '—'}
            </p>
          </div>
        </div>

        {/* Invite feedback toast */}
        {inviteMsg && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            inviteMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {inviteMsg.type === 'success'
              ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            }
            {inviteMsg.text}
          </div>
        )}
      </div>

      {/* Financial summary — collapsed by default */}
      <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-gray-400 hover:text-white transition-colors select-none flex items-center gap-2">
          <svg className="w-4 h-4 transition-transform details-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Financial Summary
        </summary>
        <div className="px-5 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-800">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total spent</p>
            <p className="mt-1 text-xl font-bold text-white">${totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per visit</p>
            <p className="mt-1 text-xl font-bold text-white">${avgPerVisit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</p>
            <p className="mt-1 text-xl font-bold text-white">{totalAppts}</p>
          </div>
        </div>
      </details>

      {/* Appointment history */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Appointment History</h2>
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('timeline')}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${viewMode === 'table' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Table
            </button>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No appointments on record</p>
          </div>
        ) : viewMode === 'timeline' ? (
          /* Timeline view */
          <div className="px-5 py-4 space-y-6">
            {Object.entries(grouped).map(([month, appts]) => (
              <div key={month}>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{month}</h3>
                <div className="relative pl-6 space-y-3">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-800" />
                  {appts.map(appt => {
                    const dt = new Date(appt.scheduled_at)
                    const nextStatus = getNextStatus(appt.status)
                    const isUpdating = updating === appt.id
                    return (
                      <div key={appt.id} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-6 top-2.5 w-3.5 h-3.5 rounded-full border-2 ${
                          appt.status === 'completed' ? 'bg-green-500/20 border-green-500' :
                          appt.status === 'cancelled' ? 'bg-red-500/20 border-red-500' :
                          'bg-blue-500/20 border-blue-500'
                        }`} />
                        <div className="p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white">{appt.services?.name ?? '—'}</p>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusStyle(appt.status)}`}>
                                  {STATUS_LABELS[appt.status]}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                                {dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                {appt.duration_minutes ? ` · ${appt.duration_minutes} min` : ''}
                              </p>
                              {appt.notes && (
                                <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">{appt.notes}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className="text-sm font-medium text-gray-300 tabular-nums">
                                ${Number(appt.amount || 0).toFixed(2)}
                              </span>
                              <div className="flex items-center gap-1">
                                {nextStatus && (
                                  <button
                                    onClick={() => advanceStatus(appt.id, appt.status)}
                                    disabled={isUpdating}
                                    className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors disabled:opacity-50 ${NEXT_ACTION_STYLES[appt.status] || ''}`}
                                  >
                                    {isUpdating ? '...' : NEXT_ACTION_LABELS[appt.status]}
                                  </button>
                                )}
                                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => cancelAppointment(appt.id)}
                                    disabled={isUpdating}
                                    className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/20 text-red-400/70 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table view */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {appointments.map(appt => {
                  const nextStatus = getNextStatus(appt.status)
                  const isUpdating = updating === appt.id
                  return (
                    <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-gray-200">{appt.services?.name ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {new Date(appt.scheduled_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(appt.status)}`}>
                          {STATUS_LABELS[appt.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-200 font-medium tabular-nums">
                        ${Number(appt.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {nextStatus && (
                            <button
                              onClick={() => advanceStatus(appt.id, appt.status)}
                              disabled={isUpdating}
                              className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors disabled:opacity-50 ${NEXT_ACTION_STYLES[appt.status] || ''}`}
                            >
                              {isUpdating ? '...' : NEXT_ACTION_LABELS[appt.status]}
                            </button>
                          )}
                          {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelAppointment(appt.id)}
                              disabled={isUpdating}
                              className="text-xs px-2 py-1 rounded-md border border-red-500/20 text-red-400/70 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Packages section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Packages</h2>
          {(profile?.role === 'admin' || profile?.role === 'manager') && (
            <button onClick={() => setShowAddPkg(true)}
              className="text-xs bg-brand/20 text-brand hover:bg-brand/30 px-2.5 py-1 rounded transition-colors">
              + Add Package
            </button>
          )}
        </div>

        {packages.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-500 text-sm">No packages</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {packages.map(pkg => {
              const remaining = pkg.total_sessions - pkg.used_sessions
              const pct = pkg.total_sessions > 0 ? Math.round((pkg.used_sessions / pkg.total_sessions) * 100) : 0
              return (
                <div key={pkg.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{pkg.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        pkg.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        pkg.status === 'exhausted' ? 'bg-red-500/20 text-red-400' :
                        pkg.status === 'expired' ? 'bg-gray-600/20 text-gray-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>{pkg.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-24 bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-brand' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{remaining}/{pkg.total_sessions} remaining</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-gray-300">${Number(pkg.price || 0).toFixed(2)}</div>
                    {pkg.expires_at && (
                      <div className="text-xs text-gray-600">
                        Exp {new Date(pkg.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Class History section */}
      {classHistory.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Class History</h2>
          </div>
          <div className="divide-y divide-gray-800/60">
            {classHistory.map(reg => (
              <div key={reg.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">{reg.class?.name || 'Unknown class'}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(reg.class_date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    {reg.class?.start_time && ` at ${reg.class.start_time.slice(0, 5)}`}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  reg.status === 'attended' ? 'bg-emerald-500/20 text-emerald-400' :
                  reg.status === 'no_show' ? 'bg-red-500/20 text-red-400' :
                  reg.status === 'cancelled' ? 'bg-gray-600/20 text-gray-400' :
                  reg.status === 'waitlisted' ? 'bg-brand/20 text-brand' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{reg.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      <Modal isOpen={showAddPkg} onClose={() => { setShowAddPkg(false); setSelectedTpl('') }} title="Add Package" size="sm">
        <form onSubmit={addPackage} className="space-y-4">
          {/* Template selector */}
          {pkgTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Template</label>
              <select value={selectedTpl} onChange={e => handleTemplateSelect(e.target.value)}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Custom package...</option>
                {pkgTemplates.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} — ${Number(t.price).toFixed(2)}{t.session_count ? ` (${t.session_count} sessions)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Package Name *</label>
            <input type="text" required value={pkgForm.name} onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
              placeholder="e.g. 10-Session Pack" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Total Sessions</label>
              <input type="number" min="1" value={pkgForm.total_sessions}
                onChange={e => setPkgForm({ ...pkgForm, total_sessions: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <input type="number" step="0.01" min="0" value={pkgForm.price}
                onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Expires</label>
            <input type="date" value={pkgForm.expires_at} onChange={e => setPkgForm({ ...pkgForm, expires_at: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddPkg(false)} className="text-sm text-gray-400 px-4 py-2">Cancel</button>
            <button type="submit" disabled={savingPkg}
              className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50">
              {savingPkg ? 'Saving…' : 'Add Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
