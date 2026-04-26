import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useOrg, useResetInactivity } from '../App'

export default function WalkIn() {
  const navigate         = useNavigate()
  const org              = useOrg()
  const resetInactivity  = useResetInactivity()
  const accent           = org?.primary_color || '#6366f1'

  const [step, setStep]         = useState('name') // 'name' | 'service'
  const [name, setName]         = useState('')
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!org) return
    supabase
      .from('services')
      .select('id, name')
      .eq('org_id', org.id)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setServices(data || []))
  }, [org])

  async function submit() {
    if (!name.trim() || !org) return
    setSubmitting(true)
    try {
      const { count } = await supabase
        .from('queue_entries')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', org.id)
        .in('status', ['waiting', 'serving'])

      const { error } = await supabase.from('queue_entries').insert({
        org_id:      org.id,
        client_name: name.trim(),
        service_id:  serviceId || null,
        status:      'waiting',
        position:    (count || 0) + 1,
      })
      if (error) throw error
      navigate('/done', { state: { type: 'walkin', name: name.trim() } })
    } catch (err) {
      alert(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080f1d] flex flex-col" onPointerDown={resetInactivity}>
      {/* Back */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 px-8 pt-8 text-gray-500 hover:text-gray-300 transition-colors no-select">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-lg">Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-12 animate-fade-up">
        {step === 'name' ? (
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-2">What's your name?</h2>
            <p className="text-gray-400 text-xl mb-10">We'll add you to the queue.</p>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); resetInactivity() }}
              onKeyDown={e => e.key === 'Enter' && name.trim() && (services.length > 0 ? setStep('service') : submit())}
              placeholder="First and last name"
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl px-6 py-5 text-white text-3xl placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
            />
            <button
              onClick={() => name.trim() && (services.length > 0 ? setStep('service') : submit())}
              disabled={!name.trim()}
              className="mt-6 w-full py-5 rounded-2xl text-2xl font-bold transition-all disabled:opacity-40 active:scale-[0.98] no-select"
              style={{ backgroundColor: accent, color: '#fff' }}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-2">What brings you in?</h2>
            <p className="text-gray-400 text-xl mb-8">Pick a service, or skip to just join the queue.</p>
            <div className="flex flex-col gap-3">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setServiceId(s.id); submit() }}
                  className="w-full text-left px-6 py-5 rounded-2xl border-2 text-2xl font-medium text-white transition-all active:scale-[0.98] no-select"
                  style={{
                    borderColor: serviceId === s.id ? accent : '#374151',
                    backgroundColor: serviceId === s.id ? accent + '20' : 'transparent',
                  }}
                >
                  {s.name}
                </button>
              ))}
              <button
                onClick={() => { setServiceId(null); submit() }}
                className="w-full text-center px-6 py-4 rounded-2xl border-2 border-gray-800 text-xl text-gray-500 transition-all active:scale-[0.98] no-select"
              >
                Skip — just add me to the queue
              </button>
            </div>
            {submitting && (
              <div className="flex items-center justify-center mt-8">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                     style={{ borderColor: accent, borderTopColor: 'transparent' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
