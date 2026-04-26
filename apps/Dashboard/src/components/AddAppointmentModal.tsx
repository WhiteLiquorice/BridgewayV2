import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { logActivity } from '../lib/logActivity'
import Modal from './Modal'

export default function AddAppointmentModal({ isOpen, onClose, onCreated, defaultDate }) {
  const { profile } = useAuth()
  const { showToast } = useToast()

  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])

  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  const [serviceId, setServiceId] = useState('')
  const [staffId, setStaffId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(60)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const searchTimer = useRef(null)
  const dropdownRef = useRef(null)

  // Set defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      setDate(defaultDate || now.toISOString().split('T')[0])
      const nextHour = new Date(now)
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
      setTime(nextHour.toTimeString().slice(0, 5))
      setSelectedClient(null)
      setClientSearch('')
      setServiceId('')
      setStaffId('')
      setDuration(60)
      setAmount('')
      setNotes('')
      setError('')
    }
  }, [isOpen, defaultDate])

  // Fetch services and staff on open
  useEffect(() => {
    if (!isOpen || !profile?.org_id) return
    supabase.from('services').select('id, name, duration_minutes, price')
      .eq('org_id', profile.org_id).eq('is_archived', false).order('name')
      .then(({ data }) => setServices(data || []))
    supabase.from('profiles').select('id, full_name, role')
      .eq('org_id', profile.org_id).in('role', ['admin', 'manager', 'staff']).eq('is_active', true).order('full_name')
      .then(({ data }) => setStaff(data || []))
  }, [isOpen, profile?.org_id])

  // Debounced client search
  useEffect(() => {
    if (!profile?.org_id) return
    clearTimeout(searchTimer.current)
    if (!clientSearch.trim()) { setClients([]); return }
    searchTimer.current = setTimeout(async () => {
      const { data } = await supabase
        .from('clients').select('id, name, email')
        .eq('org_id', profile.org_id)
        .ilike('name', `%${clientSearch}%`)
        .limit(8)
      setClients(data || [])
      setShowClientDropdown(true)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [clientSearch, profile?.org_id])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowClientDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleServiceChange(id) {
    setServiceId(id)
    const svc = services.find(s => s.id === id)
    if (svc) {
      setDuration(svc.duration_minutes)
      setAmount(String(svc.price || ''))
    }
  }

  async function handleSave() {
    if (!selectedClient) { setError('Please select a client'); return }
    if (!date || !time) { setError('Please set date and time'); return }
    setSaving(true)
    setError('')
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      const { error: err } = await supabase.from('appointments').insert({
        org_id: profile.org_id,
        client_id: selectedClient.id,
        service_id: serviceId || null,
        staff_id: staffId || null,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
        status: 'confirmed',
        amount: amount ? parseFloat(amount) : 0,
        notes: notes || null,
      })
      if (err) throw err
      logActivity({
        org_id: profile.org_id,
        user_id: profile.user_id,
        action: 'appointment.created',
        entity_type: 'appointment',
        metadata: { client_name: selectedClient.name },
      })
      showToast('Appointment created', 'success')
      onCreated?.()
      onClose()
    } catch (e) {
      setError(e.message || 'Failed to create appointment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Appointment" size="md">
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
        )}

        {/* Client search */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Client *</label>
          {selectedClient ? (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
              <span className="text-sm text-white">{selectedClient.name}</span>
              <button onClick={() => { setSelectedClient(null); setClientSearch('') }} className="text-gray-500 hover:text-white text-xs">
                Change
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              onFocus={() => clients.length > 0 && setShowClientDropdown(true)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
            />
          )}
          {showClientDropdown && clients.length > 0 && !selectedClient && (
            <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {clients.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedClient(c); setClientSearch(c.name); setShowClientDropdown(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="font-medium">{c.name}</span>
                  {c.email && <span className="text-gray-500 ml-2 text-xs">{c.email}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Service</label>
          <select
            value={serviceId}
            onChange={e => handleServiceChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
          >
            <option value="">Select service...</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min · ${s.price})</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Time *</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Duration & Staff */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Staff</label>
            <select
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
            >
              <option value="">Unassigned</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional notes..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Appointment'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
