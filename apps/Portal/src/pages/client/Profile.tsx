import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'

export default function ClientProfile() {
  const { profile, user } = useAuth()
  const { primaryColor } = useTheme()

  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [stats, setStats] = useState({ total: 0, spent: 0 })

  useEffect(() => {
    if (!profile) return
    setForm({
      full_name: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
    })
  }, [profile])

  // Fetch visit stats for this client
  useEffect(() => {
    if (!profile?.id) return
    supabase
      .from('appointments')
      .select('status, amount')
      .eq('client_id', profile.id)
      .neq('status', 'cancelled')
      .then(({ data }) => {
        const all = data || []
        setStats({
          total: all.length,
          spent: all.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0),
        })
      })
  }, [profile?.id])

  async function handleSave(e) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name, email: form.email, phone: form.phone })
        .eq('id', profile.id)
      if (error) setMsg({ type: 'error', text: error.message })
      else setMsg({ type: 'success', text: 'Profile updated.' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to save — check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-colors'
  const labelCls = 'block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2'

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-5xl tracking-tight text-neutral-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-neutral-400 mt-2">Manage your contact information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Total Visits</p>
          <p className="font-serif text-5xl text-neutral-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Total Spent</p>
          <p className="font-serif text-5xl text-neutral-900 dark:text-white">${Math.floor(stats.spent).toLocaleString()}</p>
        </div>
      </div>

      <div className="max-w-lg">
        {/* Avatar card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-7 mb-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-semibold"
              style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
            >
              {form.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-neutral-900 dark:text-white font-semibold">{form.full_name || 'Your Name'}</p>
              <p className="text-sm text-neutral-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-7">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">Contact Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input type="text" value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className={inputCls} placeholder="Your full name" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input type="text" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className={inputCls} placeholder="(555) 000-0000" />
            </div>
            <div>
              <label className={labelCls}>Login Email</label>
              <input type="text" value={user?.email || ''} disabled
                className={`${inputCls} opacity-50 cursor-not-allowed`} />
              <p className="text-xs text-neutral-400 mt-1.5">Your login email cannot be changed here.</p>
            </div>

            {msg && (
              <div className={`rounded-xl px-4 py-3 text-sm ${
                msg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium rounded-xl px-4 py-3 text-sm text-white tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
