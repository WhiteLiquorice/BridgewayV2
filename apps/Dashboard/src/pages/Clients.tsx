import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useTerminology } from '../context/TerminologyContext'
import { supabase } from '../lib/supabase'
import { downloadCSV } from '../lib/csvExport'

export default function Clients() {
  const { profile } = useAuth()
  const { terms } = useTerminology()
  const navigate   = useNavigate()
  const { openNewClient } = useOutletContext() || {}
  const [search, setSearch] = useState('')

  const orgId = profile?.org_id

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, created_at, appointments(id, scheduled_at, amount, status)')
        .eq('org_id', orgId)
        .order('name', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!orgId,
  })

  function computeStats(appts = []) {
    const valid      = appts.filter(a => a.status !== 'cancelled')
    const totalSpent = valid.reduce((s, a) => s + Number(a.amount || 0), 0)
    const sorted     = [...valid].sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
    const lastVisit  = sorted[0]?.scheduled_at ?? null
    return { totalAppts: valid.length, totalSpent, lastVisit }
  }

  const filtered = clients.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">{terms.client.plural}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clients.length} total</p>
        </div>
        <div className="flex items-center gap-3">
        <button
          onClick={() => downloadCSV(
            filtered.map(c => {
              const { totalAppts, totalSpent, lastVisit } = computeStats(c.appointments)
              return { name: c.name, email: c.email ?? '', phone: c.phone ?? '', appointments: totalAppts, total_spent: totalSpent.toFixed(2), last_visit: lastVisit ? new Date(lastVisit).toLocaleDateString() : '' }
            }),
            ['name', 'email', 'phone', 'appointments', 'total_spent', 'last_visit'],
            { name: 'Name', email: 'Email', phone: 'Phone', appointments: 'Appts', total_spent: 'Total Spent', last_visit: 'Last Visit' },
            'clients.csv'
          )}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV
        </button>
        <button
          onClick={openNewClient}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </button>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 w-56"
          />
        </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    {search ? 'No clients match your search' : 'No clients yet'}
                  </td>
                </tr>
              ) : (
                filtered.map(client => {
                  const { totalAppts, lastVisit } = computeStats(client.appointments)
                  return (
                    <tr
                      key={client.id}
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-brand">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-200 font-medium">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{client.email ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400">{client.phone ?? '—'}</td>
                      <td className="px-5 py-3.5 text-right text-gray-200 tabular-nums">{totalAppts}</td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {lastVisit
                          ? new Date(lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
