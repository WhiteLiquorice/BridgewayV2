import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, getStatusStyle, getNextStatus, NEXT_ACTION_LABELS, NEXT_ACTION_STYLES } from '../lib/appointmentStatus'
import { downloadCSV } from '../lib/csvExport'

const PAGE_SIZE = 10

export default function Appointments() {
  const { profile } = useAuth()
  const { openNewAppointment } = useOutletContext() || {}
  const queryClient = useQueryClient()

  const [page,         setPage]         = useState(0)
  const [updating,     setUpdating]     = useState(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')

  const orgId = profile?.org_id
  const filters = { statusFilter, dateFrom, dateTo }

  // Reset page when filters change
  const handleFilterChange = (setter) => (e) => {
    setPage(0)
    setter(e.target.value)
  }

  const { data: queryResult = { appointments: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['appointments', orgId, filters, page],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select('id, scheduled_at, status, amount, clients(id, name), services(name)', { count: 'exact' })
        .eq('org_id', orgId)
        .order('scheduled_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (statusFilter) query = query.eq('status', statusFilter)
      if (dateFrom)     query = query.gte('scheduled_at', new Date(dateFrom).toISOString())
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        query = query.lte('scheduled_at', end.toISOString())
      }

      const { data, count, error } = await query
      if (error) throw error
      return { appointments: data || [], total: count || 0 }
    },
    enabled: !!orgId,
  })

  const { appointments, total } = queryResult

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
      if (error) throw error
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['appointments'] })
      const queryKey = ['appointments', orgId, filters, page]
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          appointments: old.appointments.map((a) => a.id === id ? { ...a, status } : a),
        }
      })
      return { prev, queryKey }
    },
    onError: (err, vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(ctx.queryKey, ctx.prev)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })

  async function advanceStatus(id, currentStatus) {
    const next = getNextStatus(currentStatus)
    if (!next) return
    setUpdating(id)
    try {
      await updateStatus.mutateAsync({ id, status: next })
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  async function cancelAppointment(id) {
    setUpdating(id)
    try {
      await updateStatus.mutateAsync({ id, status: 'cancelled' })
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function clearFilters() {
    setStatusFilter('')
    setDateFrom('')
    setDateTo('')
    setPage(0)
  }

  const hasFilters = statusFilter || dateFrom || dateTo

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCSV(
              appointments.map(a => ({
                client: a.clients?.name ?? '',
                service: a.services?.name ?? '',
                date: new Date(a.scheduled_at).toLocaleString(),
                status: STATUS_LABELS[a.status] || a.status,
                amount: Number(a.amount || 0).toFixed(2),
              })),
              ['client', 'service', 'date', 'status', 'amount'],
              { client: 'Client', service: 'Service', date: 'Date', status: 'Status', amount: 'Amount' },
              'appointments.csv'
            )}
            disabled={appointments.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
          <button
            onClick={openNewAppointment}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              className="px-3 py-2 bg-[#0c1a2e] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={handleFilterChange(setDateFrom)}
              className="px-3 py-2 bg-[#0c1a2e] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 [color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={handleFilterChange(setDateTo)}
              className="px-3 py-2 bg-[#0c1a2e] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 [color-scheme:dark]"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map(appt => {
                  const nextStatus = getNextStatus(appt.status)
                  const isUpdating = updating === appt.id
                  return (
                    <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-gray-200 font-medium">
                        {appt.clients?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {appt.services?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {new Date(appt.scheduled_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(appt.status)}`}>
                          {STATUS_LABELS[appt.status] || appt.status}
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
