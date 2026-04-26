import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTerminology } from '../context/TerminologyContext'
import { supabase } from '../lib/supabase'

function Section({ title, children }) {
  return (
    <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.07]">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function SaveButton({ loading, saved, saveError, label = 'Save changes' }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-brand hover:opacity-90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Saving…' : label}
      </button>
      {saved && (
        <span className="text-sm text-green-400 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Saved
        </span>
      )}
      {saveError && !saved && (
        <span className="text-sm text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed to save — try again
        </span>
      )}
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/[0.10] rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-colors"

const THEMES = [
  {
    id: 'dark',
    label: 'Slate',
    bg: '#1b2333',
    surface: '#243044',
    description: 'Dark slate — default',
  },
  {
    id: 'navy',
    label: 'Navy',
    bg: '#0c1a2e',
    surface: '#111827',
    description: 'Deep navy blue',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    bg: '#030712',
    surface: '#0d1117',
    description: 'Pure black',
  },
  {
    id: 'slate',
    label: 'Cool Slate',
    bg: '#1e293b',
    surface: '#293548',
    description: 'Cool blue-grays',
  },
]

export default function Settings() {
  // profile and org come from AuthContext — already loaded, no extra fetch needed
  const { profile, org } = useAuth()
  const { theme, setTheme, accentColor, setAccentColor } = useTheme()
  const { terms, refresh: refreshTerms } = useTerminology()

  const canEdit = profile?.role === 'admin' || profile?.role === 'manager'

  // ── Terminology (admin/manager only) ────────────────────────────────────────
  const [termClientS,  setTermClientS]  = useState('')
  const [termClientP,  setTermClientP]  = useState('')
  const [termApptS,    setTermApptS]    = useState('')
  const [termApptP,    setTermApptP]    = useState('')
  const [termStaffS,   setTermStaffS]   = useState('')
  const [termStaffP,   setTermStaffP]   = useState('')
  const [termLoading,  setTermLoading]  = useState(false)
  const [termSaved,    setTermSaved]    = useState(false)
  const [termError,    setTermError]    = useState(false)

  useEffect(() => {
    setTermClientS(terms.client.singular)
    setTermClientP(terms.client.plural)
    setTermApptS(terms.appointment.singular)
    setTermApptP(terms.appointment.plural)
    setTermStaffS(terms.staff.singular)
    setTermStaffP(terms.staff.plural)
  }, [terms])

  async function saveTerminology(e) {
    e.preventDefault()
    setTermLoading(true)
    setTermSaved(false)
    setTermError(false)
    try {
      const payload = {
        client:      { singular: termClientS, plural: termClientP },
        appointment: { singular: termApptS,   plural: termApptP },
        staff:       { singular: termStaffS,  plural: termStaffP },
      }
      const { error } = await supabase
        .from('org_settings')
        .upsert({ org_id: profile.org_id, terminology: payload }, { onConflict: 'org_id' })
      if (error) throw error
      await refreshTerms()
      setTermSaved(true)
      setTimeout(() => setTermSaved(false), 3000)
    } catch {
      setTermError(true)
      setTimeout(() => setTermError(false), 4000)
    } finally {
      setTermLoading(false)
    }
  }

  // ── My Profile ──────────────────────────────────────────────────────────────
  const [fullName,      setFullName]      = useState('')
  const [profileEmail,  setProfileEmail]  = useState('')
  const [profilePhone,  setProfilePhone]  = useState('')
  const [profileSaved,  setProfileSaved]  = useState(false)
  const [profileError,  setProfileError]  = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  // Seed form from context once profile arrives
  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name  ?? '')
    setProfileEmail(profile.email  ?? '')
    setProfilePhone(profile.phone  ?? '')
  }, [profile?.id])

  async function saveProfile(e) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSaved(false)
    setProfileError(false)
    try {
      await supabase
        .from('profiles')
        .update({ full_name: fullName, email: profileEmail, phone: profilePhone })
        .eq('id', profile.id)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch {
      setProfileError(true)
      setTimeout(() => setProfileError(false), 4000)
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Clinic Info (admin/manager only) ────────────────────────────────────────
  const [orgName,    setOrgName]    = useState('')
  const [orgSaved,   setOrgSaved]   = useState(false)
  const [orgError,   setOrgError]   = useState(false)
  const [orgLoading, setOrgLoading] = useState(false)

  useEffect(() => {
    if (!org) return
    setOrgName(org.name ?? '')
  }, [org?.id])

  async function saveOrg(e) {
    e.preventDefault()
    setOrgLoading(true)
    setOrgSaved(false)
    setOrgError(false)
    try {
      await supabase
        .from('orgs')
        .update({ name: orgName })
        .eq('id', org.id)
      setOrgSaved(true)
      setTimeout(() => setOrgSaved(false), 3000)
    } catch {
      setOrgError(true)
      setTimeout(() => setOrgError(false), 4000)
    } finally {
      setOrgLoading(false)
    }
  }

  // Wait for context to arrive (AuthContext handles the spinner until then)
  if (!profile || !org) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {profile.full_name || profile.email} · {org.name}
        </p>
      </div>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs text-white/30">Choose a color theme for your dashboard. Saved locally on this device.</p>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all ${
                    theme === t.id
                      ? 'border-brand ring-1 ring-brand/50'
                      : 'border-white/[0.10] hover:border-white/[0.20]'
                  }`}
                >
                  {/* Color swatch */}
                  <div className="flex gap-1.5 mb-2">
                    <span className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: t.bg }} />
                    <span className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: t.surface }} />
                  </div>
                  <span className="text-xs font-semibold text-white">{t.label}</span>
                  <span className="text-xs text-gray-500 mt-0.5 leading-tight">{t.description}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Accent color */}
          <div className="pt-4 border-t border-white/[0.07]">
            <p className="text-xs text-white/30 mb-3">Accent color — applies to buttons, active states, and highlights. Saved locally on this device.</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/[0.12] bg-white/[0.07] cursor-pointer p-0.5"
              />
              <span className="text-sm text-gray-400 font-mono">{accentColor}</span>
              {accentColor !== '#f59e0b' && (
                <button
                  type="button"
                  onClick={() => setAccentColor('#f59e0b')}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* My Profile */}
      <Section title="My Profile">
        <form onSubmit={saveProfile} className="space-y-4">
          <Field label="Full name">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={profileEmail}
              onChange={e => setProfileEmail(e.target.value)}
              placeholder="jane@clinic.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={profilePhone}
              onChange={e => setProfilePhone(e.target.value)}
              placeholder="(417) 555-0100"
              className={inputCls}
            />
          </Field>
          <SaveButton loading={profileLoading} saved={profileSaved} saveError={profileError} />
        </form>
      </Section>

      {/* Clinic info — admin/manager only */}
      {canEdit && (
        <Section title="Clinic Information">
          <form onSubmit={saveOrg} className="space-y-4">
            <Field label="Clinic name">
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Bridgeway Chiropractic"
                className={inputCls}
              />
            </Field>
            <SaveButton loading={orgLoading} saved={orgSaved} saveError={orgError} />
          </form>
        </Section>
      )}

      {/* Services — managed in Admin app */}
      {canEdit && (
        <Section title="Service Types">
          <p className="text-sm text-gray-400">
            Service types are managed in the{' '}
            <span className="text-brand font-medium">Admin panel → Service Catalog</span>.
          </p>
        </Section>
      )}

      {/* Terminology — admin/manager only */}
      {canEdit && (
        <Section title="Terminology">
          <form onSubmit={saveTerminology} className="space-y-5">
            <p className="text-xs text-gray-500">
              Customize how your business refers to clients, appointments, and staff. Changes apply across the dashboard and client portal.
            </p>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Client</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Singular">
                  <input type="text" value={termClientS} onChange={e => setTermClientS(e.target.value)} placeholder="Client" className={inputCls} />
                </Field>
                <Field label="Plural">
                  <input type="text" value={termClientP} onChange={e => setTermClientP(e.target.value)} placeholder="Clients" className={inputCls} />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Appointment</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Singular">
                  <input type="text" value={termApptS} onChange={e => setTermApptS(e.target.value)} placeholder="Appointment" className={inputCls} />
                </Field>
                <Field label="Plural">
                  <input type="text" value={termApptP} onChange={e => setTermApptP(e.target.value)} placeholder="Appointments" className={inputCls} />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Staff</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Singular">
                  <input type="text" value={termStaffS} onChange={e => setTermStaffS(e.target.value)} placeholder="Staff" className={inputCls} />
                </Field>
                <Field label="Plural">
                  <input type="text" value={termStaffP} onChange={e => setTermStaffP(e.target.value)} placeholder="Staff" className={inputCls} />
                </Field>
              </div>
            </div>
            <SaveButton loading={termLoading} saved={termSaved} saveError={termError} />
          </form>
        </Section>
      )}
    </div>
  )
}
