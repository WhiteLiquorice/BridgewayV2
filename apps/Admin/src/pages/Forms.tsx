import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const FIELD_TYPES = [
  { type: 'text',      label: 'Short Text' },
  { type: 'textarea',  label: 'Long Text' },
  { type: 'checkbox',  label: 'Checkbox' },
  { type: 'signature', label: 'Signature' },
  { type: 'dropdown',  label: 'Dropdown' },
]

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function FieldEditor({ field, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="bg-[#0d1f35] border border-gray-700/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5">
          <button disabled={isFirst} onClick={onMoveUp}
            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button disabled={isLast} onClick={onMoveDown}
            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Field type */}
        <select
          value={field.type}
          onChange={e => onChange({ ...field, type: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        >
          {FIELD_TYPES.map(t => (
            <option key={t.type} value={t.type}>{t.label}</option>
          ))}
        </select>

        {/* Required toggle */}
        <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={e => onChange({ ...field, required: e.target.checked })}
            className="w-3.5 h-3.5 accent-brand"
          />
          Required
        </label>

        {/* Remove */}
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Label */}
      <input
        type="text"
        value={field.label || ''}
        onChange={e => onChange({ ...field, label: e.target.value })}
        placeholder="Field label..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/50"
      />

      {/* Dropdown options */}
      {field.type === 'dropdown' && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Options (one per line)</label>
          <textarea
            rows={3}
            value={(field.options || []).join('\n')}
            onChange={e => onChange({ ...field, options: e.target.value.split('\n').filter(Boolean) })}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/50 resize-none"
          />
        </div>
      )}
    </div>
  )
}

function FormModal({ form, onClose, onSaved, orgId }) {
  const [name, setName] = useState(form?.name || '')
  const [fields, setFields] = useState(form?.fields || [])
  const [isActive, setIsActive] = useState(form?.is_active ?? true)
  const [saving, setSaving] = useState(false)

  function addField() {
    setFields(prev => [...prev, { id: generateId(), type: 'text', label: '', required: false }])
  }

  function updateField(idx, updated) {
    setFields(prev => prev.map((f, i) => i === idx ? updated : f))
  }

  function removeField(idx) {
    setFields(prev => prev.filter((_, i) => i !== idx))
  }

  function moveField(idx, dir) {
    setFields(prev => {
      const next = [...prev]
      const swap = idx + dir
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    const payload = { org_id: orgId, name: name.trim(), fields, is_active: isActive }
    const { error } = form?.id
      ? await supabase.from('intake_form_templates').update(payload).eq('id', form.id)
      : await supabase.from('intake_form_templates').insert(payload)
    setSaving(false)
    if (!error) onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl bg-[#0c1a2e] border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">{form?.id ? 'Edit Form' : 'New Form'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Form name */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Form name (e.g. New Patient Intake)"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-brand" />
              Active
            </label>
          </div>

          {/* Fields */}
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <FieldEditor
                key={field.id}
                field={field}
                onChange={updated => updateField(idx, updated)}
                onRemove={() => removeField(idx)}
                onMoveUp={() => moveField(idx, -1)}
                onMoveDown={() => moveField(idx, 1)}
                isFirst={idx === 0}
                isLast={idx === fields.length - 1}
              />
            ))}
          </div>

          <button
            onClick={addField}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-700 text-sm text-gray-500 hover:border-brand/50 hover:text-brand transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Field
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-5 py-2 bg-brand hover:bg-brand disabled:opacity-50 text-[#0c1a2e] font-semibold text-sm rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : 'Save Form'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Forms() {
  const { org } = useAuth()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingForm, setEditingForm] = useState(null)

  async function loadForms() {
    if (!org?.id) return
    const { data } = await supabase
      .from('intake_form_templates')
      .select('id, name, fields, is_active, created_at')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false })
    setForms(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadForms()
  }, [org?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleToggleActive(form) {
    await supabase.from('intake_form_templates')
      .update({ is_active: !form.is_active })
      .eq('id', form.id)
    loadForms()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this form? This cannot be undone.')) return
    await supabase.from('intake_form_templates').delete().eq('id', id)
    loadForms()
  }

  function openNew() { setEditingForm(null); setModalOpen(true) }
  function openEdit(form) { setEditingForm(form); setModalOpen(true) }
  function closeModal() { setModalOpen(false); setEditingForm(null) }
  function onSaved() { closeModal(); loadForms() }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Intake Forms</h1>
          <p className="text-sm text-gray-500 mt-0.5">Build forms that clients complete before their appointments</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand hover:bg-brand text-[#0c1a2e] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Form
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1f35]/50 rounded-2xl border border-gray-800">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No forms yet. Create your first intake form.</p>
          <button onClick={openNew} className="mt-3 text-brand hover:text-brand text-sm font-medium transition-colors">
            Create a form →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map(form => (
            <div key={form.id} className="bg-[#0d1f35] border border-gray-700/50 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{form.name}</p>
                  {!form.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {(form.fields || []).length} field{(form.fields || []).length !== 1 ? 's' : ''}
                  {' · '}
                  Created {new Date(form.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(form)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    form.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-gray-700 text-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {form.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => openEdit(form)}
                  className="text-gray-500 hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-brand/10"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <FormModal
          form={editingForm}
          onClose={closeModal}
          onSaved={onSaved}
          orgId={org?.id}
        />
      )}
    </div>
  )
}
