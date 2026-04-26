import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

// ── Field renderer (read/write) ───────────────────────────────────────────────
function FieldInput({ field, value, onChange }) {
  if (field.type === 'text') {
    return (
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={field.label}
        required={field.required}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        rows={3}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={field.label}
        required={field.required}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
      />
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value || false}
          onChange={e => onChange(e.target.checked)}
          required={field.required}
          className="mt-0.5 w-4 h-4 accent-amber-500 flex-shrink-0"
        />
        <span className="text-sm text-gray-300">{field.label}</span>
      </label>
    )
  }

  if (field.type === 'dropdown') {
    return (
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        required={field.required}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      >
        <option value="">Select an option…</option>
        {(field.options || []).map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'signature') {
    return <SignatureField value={value} onChange={onChange} required={field.required} />
  }

  return null
}

// Canvas-based signature pad
function SignatureField({ value, onChange, required }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [hasSig, setHasSig] = useState(!!value)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = value
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  function onStart(e) {
    e.preventDefault()
    drawing.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function onMove(e) {
    if (!drawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function onEnd() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL()
    setHasSig(true)
    onChange(dataUrl)
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
    onChange(null)
  }

  return (
    <div>
      <div className="relative rounded-lg overflow-hidden border border-gray-700">
        <canvas
          ref={canvasRef}
          width={480}
          height={120}
          className="w-full touch-none"
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
        {!hasSig && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-600">Sign here</span>
          </div>
        )}
      </div>
      {hasSig && (
        <button onClick={clear} className="mt-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
          Clear signature
        </button>
      )}
      {required && !hasSig && (
        <input type="text" required className="sr-only" aria-hidden tabIndex={-1} readOnly value="" />
      )}
    </div>
  )
}

// ── Single form submission view ────────────────────────────────────────────────
function FormSubmitter({ form, appointmentId, clientId, onSubmitted }) {
  const [responses, setResponses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { org } = useAuth()

  function setResponse(fieldId, value) {
    setResponses(prev => ({ ...prev, [fieldId]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('intake_form_submissions').insert({
      org_id: org.id,
      form_id: form.id,
      client_id: clientId,
      appointment_id: appointmentId || null,
      responses,
    })
    setSubmitting(false)
    if (!error) onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white mb-4">{form.name}</h3>
        <div className="space-y-4">
          {(form.fields || []).map(field => (
            <div key={field.id}>
              {field.type !== 'checkbox' && (
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
              )}
              <FieldInput
                field={field}
                value={responses[field.id]}
                onChange={val => setResponse(field.id, val)}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#0c1a2e] font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {submitting ? 'Submitting…' : 'Submit Form'}
      </button>
    </form>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function IntakeForms() {
  const { org, user } = useAuth()
  const [pendingForms, setPendingForms] = useState([]) // { form, appointmentId, clientId }
  const [completedForms, setCompletedForms] = useState([])
  const [activeFormIdx, setActiveFormIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    if (!org?.id || !user?.id) return
    loadForms()
  }, [org?.id, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadForms() {
    setLoading(true)

    // Get client record for this user
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('org_id', org.id)
      .eq('user_id', user.id)
      .single()

    const clientId = clientData?.id
    if (!clientId) { setLoading(false); return }

    // Get upcoming appointments (next 7 days)
    const now = new Date().toISOString()
    const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: appts } = await supabase
      .from('appointments')
      .select('id')
      .eq('org_id', org.id)
      .eq('client_id', clientId)
      .gte('scheduled_at', now)
      .lte('scheduled_at', week)
      .in('status', ['confirmed', 'arrived'])

    // Get active form templates
    const { data: templates } = await supabase
      .from('intake_form_templates')
      .select('id, name, fields')
      .eq('org_id', org.id)
      .eq('is_active', true)

    // Get already-submitted forms
    const { data: submissions } = await supabase
      .from('intake_form_submissions')
      .select('form_id, appointment_id')
      .eq('org_id', org.id)
      .eq('client_id', clientId)

    const submittedKeys = new Set(
      (submissions || []).map(s => `${s.form_id}::${s.appointment_id || ''}`)
    )

    // Build pending list: one entry per form × appointment combination not yet submitted
    const pending = []
    const completed = []
    for (const tmpl of templates || []) {
      const apptList = appts?.length ? appts : [{ id: null }]
      for (const appt of apptList) {
        const key = `${tmpl.id}::${appt.id || ''}`
        if (!submittedKeys.has(key)) {
          pending.push({ form: tmpl, appointmentId: appt.id, clientId })
        } else {
          completed.push(tmpl)
        }
      }
    }

    setPendingForms(pending)
    setCompletedForms([...new Map(completed.map(f => [f.id, f])).values()])
    setLoading(false)
  }

  function handleSubmitted() {
    setJustSubmitted(true)
    setTimeout(() => {
      setJustSubmitted(false)
      // Move to next pending form
      setPendingForms(prev => {
        const next = prev.slice(1)
        setActiveFormIdx(0)
        if (next.length === 0) loadForms()
        return next
      })
    }, 1800)
  }

  const current = pendingForms[activeFormIdx]

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Intake Forms</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete any required forms before your appointment</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : justSubmitted ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-medium">Form submitted!</p>
        </div>
      ) : pendingForms.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/50 rounded-2xl border border-gray-800">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white text-sm font-medium mb-1">You're all set!</p>
          <p className="text-gray-500 text-xs">No pending intake forms at this time.</p>
          {completedForms.length > 0 && (
            <div className="mt-4 text-xs text-gray-600">
              Completed: {completedForms.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress indicator */}
          {pendingForms.length > 1 && (
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>Form {activeFormIdx + 1} of {pendingForms.length}</span>
              <div className="flex gap-1">
                {pendingForms.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFormIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === activeFormIdx ? 'bg-amber-500' : 'bg-gray-700'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {current && (
            <FormSubmitter
              key={`${current.form.id}-${current.appointmentId}`}
              form={current.form}
              appointmentId={current.appointmentId}
              clientId={current.clientId}
              onSubmitted={handleSubmitted}
            />
          )}
        </div>
      )}
    </div>
  )
}
