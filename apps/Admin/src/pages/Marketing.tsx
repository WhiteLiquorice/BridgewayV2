import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = 'SMS' | 'Email' | 'Both'

interface TriggerConfig {
  id: string
  org_id?: string
  triggerId: string
  icon?: string
  title: string
  description: string
  channel: Channel
  enabled: boolean
  delayValue: number
  delayUnit: 'hours' | 'days'
  message: string
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_TRIGGERS: TriggerConfig[] = [
  {
    id: 'reengagement',
    triggerId: 'reengagement',
    title: 'Re-Engagement',
    description: 'Reach out to clients who haven\'t booked in a set number of days.',
    channel: 'SMS',
    enabled: false,
    delayValue: 30,
    delayUnit: 'days',
    message: 'Hey {name}, we miss you! It\'s been a while — book your next appointment here: {booking_link}',
  },
  {
    id: 'review_request',
    triggerId: 'review_request',
    title: 'Review Request',
    description: 'Send a review link automatically after an appointment is marked complete.',
    channel: 'SMS',
    enabled: false,
    delayValue: 2,
    delayUnit: 'hours',
    message: 'Thanks for visiting {org_name}, {name}! We\'d love your feedback: {review_link}',
  },
  {
    id: 'birthday',
    triggerId: 'birthday',
    title: 'Birthday Discount',
    description: 'Send a personalized discount code on a client\'s birthday.',
    channel: 'Email',
    enabled: false,
    delayValue: 0,
    delayUnit: 'hours',
    message: 'Happy Birthday {name}! 🎉 Treat yourself — here\'s 15% off your next visit: {discount_code}',
  },
]

const VARIABLES = ['{name}', '{org_name}', '{booking_link}', '{discount_code}', '{review_link}']

// ─── Components ──────────────────────────────────────────────────────────────

function TriggerCard({ trigger, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [local, setLocal] = useState(trigger)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function insertVariable(v: string) {
    const el = textareaRef.current
    if (!el) { setLocal(l => ({ ...l, message: l.message + v })); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newMsg = local.message.slice(0, start) + v + local.message.slice(end)
    setLocal(l => ({ ...l, message: newMsg }))
  }

  async function handleSave() {
    setSaving(true)
    await onUpdate(local)
    setSaving(false)
    setExpanded(false)
  }

  return (
    <div className={`bg-gray-900 border rounded-xl transition-all ${local.enabled ? 'border-brand/30' : 'border-gray-800'}`}>
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-white">{local.title}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border bg-gray-800 text-gray-400`}>{local.channel}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{local.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-400 hover:text-white transition-colors">
            {expanded ? 'Collapse' : 'Configure'}
          </button>
          <button
            onClick={() => { const next = !local.enabled; setLocal(l => ({ ...l, enabled: next })); onUpdate({ ...local, enabled: next }) }}
            className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors ${local.enabled ? 'bg-brand' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${local.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Channel</label>
              <div className="flex gap-2">
                {['SMS', 'Email', 'Both'].map(ch => (
                  <button key={ch} onClick={() => setLocal(l => ({ ...l, channel: ch }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${local.channel === ch ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Send After</label>
              <div className="flex gap-2">
                <input type="number" value={local.delayValue} onChange={e => setLocal(l => ({ ...l, delayValue: parseInt(e.target.value) || 0 }))}
                  className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50" />
                <select value={local.delayUnit} onChange={e => setLocal(l => ({ ...l, delayUnit: e.target.value as any }))}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50">
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-400">Message Template</label>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {VARIABLES.map(v => (
                  <button key={v} onClick={() => insertVariable(v)} className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-brand text-xs rounded font-mono transition-colors">{v}</button>
                ))}
              </div>
            </div>
            <textarea ref={textareaRef} value={local.message} onChange={e => setLocal(l => ({ ...l, message: e.target.value }))} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none font-mono leading-relaxed" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setExpanded(false)} className="px-4 py-2 text-xs rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs rounded-lg bg-brand hover:bg-amber-400 text-[#0c1a2e] font-semibold transition-colors">
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Marketing() {
  const { profile } = useAuth()
  const [triggers, setTriggers] = useState<TriggerConfig[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTriggers() {
    if (!profile?.org_id) return
    setLoading(true)
    try {
      const { data } = await supabase.from('marketing_triggers').select('*').eq('org_id', profile.org_id)
      
      if (data && data.length > 0) {
        setTriggers(data)
      } else {
        // Initialize with defaults if none exist
        const initial = DEFAULT_TRIGGERS.map(t => ({ ...t, org_id: profile.org_id }))
        await supabase.from('marketing_triggers').insert(initial)
        setTriggers(initial)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTriggers() }, [profile?.org_id])

  async function handleUpdate(trigger) {
    const { id, ...payload } = trigger
    await supabase.from('marketing_triggers').update(payload).eq('org_id', profile.org_id).eq('triggerId', trigger.triggerId)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Marketing Automation</h1>
          <p className="text-sm text-gray-500 mt-1">Trigger-based campaigns that run automatically. {triggers.filter(t => t.enabled).length} automations active.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">System Ready</span>
        </div>
      </div>

      <div className="space-y-3">
        {triggers.map(t => (
          <TriggerCard key={t.triggerId} trigger={t} onUpdate={handleUpdate} />
        ))}
      </div>

      <div className="mt-6 bg-gray-900/50 border border-gray-800/50 rounded-xl px-5 py-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="text-gray-400 font-medium">To activate delivery:</span> These triggers will automatically enqueue SMS/Email tasks in the background. Delivery status can be tracked in the logs.
        </p>
      </div>
    </div>
  )
}
