import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function exportCSV(staff, week) {
  const header = 'Staff Member,Commission Rate,Earned (Week),Appts'
  const rows = staff.map(s => [
    s.full_name,
    `${s.commission_rate_percentage}%`,
    `$${s.earned_week.toFixed(2)}`,
    s.appointments_week,
  ].join(',')).join('\n')
  const csv = `${header}\n${rows}`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `commissions-report.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Commissions() {
  const { profile } = useAuth()
  const [staff, setStaff] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [newRate, setNewRate] = useState(0)

  async function loadData() {
    if (!profile?.org_id) return
    setLoading(true)
    try {
      // 1. Get staff
      const { data: st } = await supabase
        .from('profiles')
        .select('id, full_name, commission_rate_percentage')
        .eq('org_id', profile.org_id)
        .neq('role', 'patient')
        .eq('is_active', true)

      // 2. Get transactions for the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: tx } = await supabase
        .from('pos_transactions')
        .select('staff_id, commission_amount, total_cents, created_at')
        .eq('org_id', profile.org_id)
        .gte('created_at', sevenDaysAgo.toISOString())

      setStaff(st || [])
      setTransactions(tx || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [profile?.org_id])

  const staffStats = useMemo(() => {
    return staff.map(s => {
      const sTx = transactions.filter(t => t.staff_id === s.id)
      return {
        ...s,
        earned_week: sTx.reduce((sum, t) => sum + (t.commission_amount || 0), 0),
        appointments_week: sTx.length,
        avatar: s.full_name?.charAt(0) || '?'
      }
    })
  }, [staff, transactions])

  const totalEarned = staffStats.reduce((sum, s) => sum + s.earned_week, 0)
  const topEarner = [...staffStats].sort((a, b) => b.earned_week - a.earned_week)[0]
  const totalAppts = staffStats.reduce((sum, s) => sum + s.appointments_week, 0)

  async function updateRate() {
    if (!editingId) return
    const { error } = await supabase
      .from('profiles')
      .update({ commission_rate_percentage: newRate })
      .eq('id', editingId)
    
    if (!error) {
      setStaff(prev => prev.map(s => s.id === editingId ? { ...s, commission_rate_percentage: newRate } : s))
      setEditingId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Commission Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time earnings based on closed POS transactions.</p>
        </div>
        <button
          onClick={() => exportCSV(staffStats, 'This Week')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Payout (7d)</p>
          <p className="text-2xl font-bold text-green-400">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Top Earner</p>
          <p className="text-2xl font-bold text-white">{topEarner?.full_name || '—'}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Transactions (7d)</p>
          <p className="text-2xl font-bold text-white">{totalAppts}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-white/5">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Staff Member</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Rate</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Sales (7d)</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Earned (7d)</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {staffStats.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">{s.avatar}</div>
                    <p className="text-white font-medium text-sm">{s.full_name}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-300 font-mono">{s.commission_rate_percentage}%</td>
                <td className="px-5 py-4 text-gray-400">{s.appointments_week}</td>
                <td className="px-5 py-4">
                  <span className="text-green-400 font-semibold">${s.earned_week.toFixed(2)}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => { setEditingId(s.id); setNewRate(s.commission_rate_percentage) }}
                    className="text-xs text-brand hover:underline"
                  >
                    Adjust Rate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Adjust Commission</h2>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-2">Percentage Rate (%)</label>
              <input
                type="number" value={newRate} onChange={e => setNewRate(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={updateRate} className="flex-1 bg-brand text-[#0c1a2e] font-semibold py-2 rounded-lg">Save</button>
              <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-800 text-white py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
