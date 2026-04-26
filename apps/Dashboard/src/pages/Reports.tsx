import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TABS = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'clients', label: 'Clients' },
]

function ChartTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold text-white">
          {prefix}{typeof p.value === 'number' && prefix === '$'
            ? p.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : p.value}
        </p>
      ))}
    </div>
  )
}

function downloadCSV(filename, headers, rows) {
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getLast6Months() {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, date: d })
  }
  return months
}

// ─── Revenue Tab ───────────────────────────────────────────────

function RevenueTab({ orgId }) {
  const [chartData, setChartData] = useState([])
  const [byService, setByService] = useState([])
  const [byStaff, setByStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  async function load() {
    setLoading(true)
    try {
      const sixAgo = new Date()
      sixAgo.setMonth(sixAgo.getMonth() - 5)
      sixAgo.setDate(1)
      sixAgo.setHours(0, 0, 0, 0)

      const { data: appts } = await supabase
        .from('appointments')
        .select('scheduled_at, amount, status, services(name), staff_id')
        .eq('org_id', orgId)
        .neq('status', 'cancelled')
        .gte('scheduled_at', sixAgo.toISOString())

      const rows = appts || []

      // Monthly chart
      const months = getLast6Months()
      const buckets = {}
      months.forEach(m => { buckets[m.key] = 0 })
      rows.forEach(a => {
        const d = new Date(a.scheduled_at)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (key in buckets) buckets[key] += Number(a.amount || 0)
      })
      setChartData(months.map(m => ({ month: m.key, revenue: buckets[m.key] })))

      // By service
      const svcMap = {}
      rows.forEach(a => {
        const name = a.services?.name ?? 'Unknown'
        if (!svcMap[name]) svcMap[name] = { count: 0, revenue: 0 }
        svcMap[name].count++
        svcMap[name].revenue += Number(a.amount || 0)
      })
      setByService(Object.entries(svcMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.revenue - a.revenue))

      // By staff
      const staffIds = [...new Set(rows.filter(a => a.staff_id).map(a => a.staff_id))]
      let staffMap = {}
      if (staffIds.length > 0) {
        const { data: staffData } = await supabase.from('profiles').select('id, full_name').in('id', staffIds)
        if (staffData) staffData.forEach(s => { staffMap[s.id] = s.full_name })
      }
      const staffAgg = {}
      rows.forEach(a => {
        const name = staffMap[a.staff_id] || 'Unassigned'
        if (!staffAgg[name]) staffAgg[name] = { count: 0, revenue: 0 }
        staffAgg[name].count++
        staffAgg[name].revenue += Number(a.amount || 0)
      })
      setByStaff(Object.entries(staffAgg).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.revenue - a.revenue))
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card title="Monthly Revenue (6 months)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} width={45} />
              <Tooltip content={<ChartTooltip prefix="$" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* By service */}
      <Card title="By Service Type" action={
        <ExportBtn onClick={() => downloadCSV('revenue-by-service.csv',
          ['Service', 'Appointments', 'Revenue'],
          byService.map(r => [r.name, r.count, r.revenue.toFixed(2)])
        )} />
      }>
        <Table
          headers={['Service', 'Appointments', 'Revenue']}
          rows={byService}
          render={r => [
            <td key="n" className="px-5 py-3 text-gray-200 font-medium">{r.name}</td>,
            <td key="c" className="px-5 py-3 text-right text-gray-400 tabular-nums">{r.count}</td>,
            <td key="r" className="px-5 py-3 text-right text-gray-200 font-semibold tabular-nums">${r.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>,
          ]}
          empty="No revenue data"
        />
      </Card>

      {/* By staff */}
      <Card title="By Staff Member" action={
        <ExportBtn onClick={() => downloadCSV('revenue-by-staff.csv',
          ['Staff', 'Appointments', 'Revenue'],
          byStaff.map(r => [r.name, r.count, r.revenue.toFixed(2)])
        )} />
      }>
        <Table
          headers={['Staff', 'Appointments', 'Revenue']}
          rows={byStaff}
          render={r => [
            <td key="n" className="px-5 py-3 text-gray-200 font-medium">{r.name}</td>,
            <td key="c" className="px-5 py-3 text-right text-gray-400 tabular-nums">{r.count}</td>,
            <td key="r" className="px-5 py-3 text-right text-gray-200 font-semibold tabular-nums">${r.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>,
          ]}
          empty="No revenue data"
        />
      </Card>
    </div>
  )
}

// ─── Attendance Tab ────────────────────────────────────────────

function AttendanceTab({ orgId }) {
  const [monthlyRegs, setMonthlyRegs] = useState([])
  const [topClasses, setTopClasses] = useState([])
  const [fillRate, setFillRate] = useState(null)
  const [noShowRate, setNoShowRate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  async function load() {
    setLoading(true)
    try {
      const sixAgo = new Date()
      sixAgo.setMonth(sixAgo.getMonth() - 5)
      sixAgo.setDate(1)
      sixAgo.setHours(0, 0, 0, 0)

      const [regRes, classRes, apptRes] = await Promise.all([
        supabase.from('class_registrations')
          .select('created_at, class_sessions(class_templates(name, capacity))')
          .eq('org_id', orgId)
          .gte('created_at', sixAgo.toISOString()),
        supabase.from('class_sessions')
          .select('id, class_templates(name, capacity)')
          .eq('org_id', orgId),
        supabase.from('appointments')
          .select('status')
          .eq('org_id', orgId)
          .gte('scheduled_at', sixAgo.toISOString()),
      ])

      const regs = regRes.data || []
      const sessions = classRes.data || []
      const appts = apptRes.data || []

      // Monthly registrations
      const months = getLast6Months()
      const buckets = {}
      months.forEach(m => { buckets[m.key] = 0 })
      regs.forEach(r => {
        if (!r.created_at) return
        const d = new Date(r.created_at)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (key in buckets) buckets[key]++
      })
      setMonthlyRegs(months.map(m => ({ month: m.key, registrations: buckets[m.key] })))

      // Top 5 classes by registration count
      const classCount = {}
      regs.forEach(r => {
        const name = r.class_sessions?.class_templates?.name || 'Unknown'
        classCount[name] = (classCount[name] || 0) + 1
      })
      const top = Object.entries(classCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      setTopClasses(top)

      // Fill rate: registrations / total capacity across sessions
      const totalCap = sessions.reduce((s, sess) => s + (sess.class_templates?.capacity || 0), 0)
      if (totalCap > 0) {
        setFillRate(Math.round((regs.length / totalCap) * 100))
      }

      // No-show rate from appointments
      const total = appts.length
      const noShows = appts.filter(a => a.status === 'no_show').length
      if (total > 0) {
        setNoShowRate(Math.round((noShows / total) * 100))
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Avg Fill Rate" value={fillRate !== null ? `${fillRate}%` : '—'} />
        <StatCard label="No-Show Rate" value={noShowRate !== null ? `${noShowRate}%` : '—'} />
      </div>

      {/* Monthly registrations chart */}
      <Card title="Class Registrations / Month">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRegs} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} width={35} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="registrations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top 5 classes */}
      <Card title="Top 5 Classes" action={
        <ExportBtn onClick={() => downloadCSV('top-classes.csv',
          ['Class', 'Registrations'],
          topClasses.map(r => [r.name, r.count])
        )} />
      }>
        <Table
          headers={['Class', 'Registrations']}
          rows={topClasses}
          render={r => [
            <td key="n" className="px-5 py-3 text-gray-200 font-medium">{r.name}</td>,
            <td key="c" className="px-5 py-3 text-right text-gray-400 tabular-nums">{r.count}</td>,
          ]}
          empty="No class registration data"
        />
      </Card>
    </div>
  )
}

// ─── Clients Tab ───────────────────────────────────────────────

function ClientsTab({ orgId }) {
  const [monthlyNew, setMonthlyNew] = useState([])
  const [retentionRate, setRetentionRate] = useState(null)
  const [avgVisits, setAvgVisits] = useState(null)
  const [winBack, setWinBack] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  async function load() {
    setLoading(true)
    try {
      const sixAgo = new Date()
      sixAgo.setMonth(sixAgo.getMonth() - 5)
      sixAgo.setDate(1)
      sixAgo.setHours(0, 0, 0, 0)

      const [clientRes, apptRes] = await Promise.all([
        supabase.from('clients')
          .select('id, name, phone, email, created_at')
          .eq('org_id', orgId),
        supabase.from('appointments')
          .select('client_id, scheduled_at, status')
          .eq('org_id', orgId)
          .neq('status', 'cancelled'),
      ])

      const clients = clientRes.data || []
      const appts = apptRes.data || []

      // New clients per month
      const months = getLast6Months()
      const buckets = {}
      months.forEach(m => { buckets[m.key] = 0 })
      clients.forEach(c => {
        if (!c.created_at) return
        const d = new Date(c.created_at)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (key in buckets) buckets[key]++
      })
      setMonthlyNew(months.map(m => ({ month: m.key, clients: buckets[m.key] })))

      // Avg visits per client
      const visitCount = {}
      appts.forEach(a => {
        if (!a.client_id) return
        visitCount[a.client_id] = (visitCount[a.client_id] || 0) + 1
      })
      const ids = Object.keys(visitCount)
      if (ids.length > 0) {
        const total = ids.reduce((s, id) => s + visitCount[id], 0)
        setAvgVisits((total / ids.length).toFixed(1))
      }

      // Retention: clients with 2+ visits in last 6 months / clients with 1+ visit
      const withVisits = ids.length
      const returning = ids.filter(id => visitCount[id] >= 2).length
      if (withVisits > 0) {
        setRetentionRate(Math.round((returning / withVisits) * 100))
      }

      // Win-back: clients with no appointment in 60+ days
      const now = new Date()
      const sixtyDaysAgo = new Date(now)
      sixtyDaysAgo.setDate(now.getDate() - 60)

      const lastVisit = {}
      appts.forEach(a => {
        if (!a.client_id) return
        const d = new Date(a.scheduled_at)
        if (!lastVisit[a.client_id] || d > lastVisit[a.client_id]) {
          lastVisit[a.client_id] = d
        }
      })

      const winBackList = clients
        .filter(c => {
          const last = lastVisit[c.id]
          return last && last < sixtyDaysAgo
        })
        .map(c => ({
          ...c,
          lastVisit: lastVisit[c.id],
          daysSince: Math.floor((now - lastVisit[c.id]) / (1000 * 60 * 60 * 24)),
        }))
        .sort((a, b) => b.daysSince - a.daysSince)
        .slice(0, 20)

      setWinBack(winBackList)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Retention Rate" value={retentionRate !== null ? `${retentionRate}%` : '—'} sub="Clients with 2+ visits" />
        <StatCard label="Avg Visits / Client" value={avgVisits ?? '—'} />
      </div>

      {/* New clients per month */}
      <Card title="New Clients / Month">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyNew}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} width={35} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="clients" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Win-back list */}
      <Card title="Win-Back List (60+ Days Inactive)" action={
        <ExportBtn onClick={() => downloadCSV('win-back.csv',
          ['Name', 'Email', 'Phone', 'Days Since Last Visit'],
          winBack.map(r => [r.name, r.email || '', r.phone || '', r.daysSince])
        )} />
      }>
        <Table
          headers={['Client', 'Last Visit', 'Days Inactive']}
          rows={winBack}
          render={r => [
            <td key="n" className="px-5 py-3 text-gray-200 font-medium">{r.name}</td>,
            <td key="d" className="px-5 py-3 text-gray-400">{r.lastVisit.toLocaleDateString()}</td>,
            <td key="days" className="px-5 py-3 text-right">
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.daysSince >= 90 ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {r.daysSince}d
              </span>
            </td>,
          ]}
          empty="No inactive clients found"
        />
      </Card>
    </div>
  )
}

// ─── Shared UI Components ──────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function Card({ title, action, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="mt-1.5 text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function ExportBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      CSV
    </button>
  )
}

function Table({ headers, rows, render, empty }) {
  return (
    <div className="overflow-x-auto -m-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {headers.map((h, i) => (
              <th key={h} className={`${i === 0 ? 'text-left' : 'text-right'} px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-5 py-10 text-center text-gray-500">{empty}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">{render(r)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Reports Page ─────────────────────────────────────────

export default function Reports() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('revenue')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Business analytics and insights</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-brand/15 text-brand'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'revenue' && <RevenueTab orgId={profile?.org_id} />}
      {tab === 'attendance' && <AttendanceTab orgId={profile?.org_id} />}
      {tab === 'clients' && <ClientsTab orgId={profile?.org_id} />}
    </div>
  )
}
