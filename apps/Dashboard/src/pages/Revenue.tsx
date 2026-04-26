import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function Revenue() {
  const { profile } = useAuth()
  const [chartData,      setChartData]      = useState([])
  const [serviceBreakdown, setServiceBreakdown] = useState([])
  const [totalRevenue,   setTotalRevenue]   = useState(0)
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchData()
  }, [profile?.org_id])

  async function fetchData() {
    setLoading(true)
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
      sixMonthsAgo.setDate(1)
      sixMonthsAgo.setHours(0, 0, 0, 0)

      const { data: appts } = await supabase
        .from('appointments')
        .select('scheduled_at, amount, status, services(name)')
        .eq('org_id', profile.org_id)
        .neq('status', 'cancelled')
        .gte('scheduled_at', sixMonthsAgo.toISOString())
        .order('scheduled_at', { ascending: true })

      if (!appts) return

      // Build last-6-months chart data
      const now     = new Date()
      const buckets = {}
      for (let i = 5; i >= 0; i--) {
        const d   = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        buckets[key] = 0
      }
      appts.forEach(a => {
        const d   = new Date(a.scheduled_at)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (key in buckets) buckets[key] += Number(a.amount || 0)
      })
      const chart = Object.entries(buckets).map(([month, revenue]) => ({ month, revenue }))
      setChartData(chart)

      // Service breakdown
      const svcMap = {}
      appts.forEach(a => {
        const name = a.services?.name ?? 'Unknown'
        if (!svcMap[name]) svcMap[name] = { count: 0, revenue: 0 }
        svcMap[name].count++
        svcMap[name].revenue += Number(a.amount || 0)
      })
      const breakdown = Object.entries(svcMap)
        .map(([name, { count, revenue }]) => ({ name, count, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
      setServiceBreakdown(breakdown)

      setTotalRevenue(appts.reduce((s, a) => s + Number(a.amount || 0), 0))
    } catch {
      // leave existing zeros in place
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Revenue</h1>
        <p className="text-sm text-gray-500 mt-0.5">Last 6 months</p>
      </div>

      {/* Summary card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 inline-flex flex-col">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">6-month total</p>
        <p className="mt-1.5 text-3xl font-bold text-white">
          ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Bar chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-5">Monthly Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="35%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1f2937"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">Breakdown by Service</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Appt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {serviceBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    No revenue data yet
                  </td>
                </tr>
              ) : (
                serviceBreakdown.map(row => (
                  <tr key={row.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-gray-200 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5 text-right text-gray-400 tabular-nums">{row.count}</td>
                    <td className="px-5 py-3.5 text-right text-gray-200 font-semibold tabular-nums">
                      ${row.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-400 tabular-nums">
                      ${(row.revenue / row.count).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {serviceBreakdown.length > 0 && (
              <tfoot className="border-t border-gray-700">
                <tr>
                  <td className="px-5 py-3.5 text-sm font-semibold text-white">Total</td>
                  <td className="px-5 py-3.5 text-right text-gray-300 font-semibold tabular-nums">
                    {serviceBreakdown.reduce((s, r) => s + r.count, 0)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-brand font-bold tabular-nums">
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
