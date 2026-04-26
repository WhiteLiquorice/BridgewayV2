import { useState, useEffect } from 'react'

// ═════════════════════════════════════════════════════════════════════════════
// InteractiveDemo — split-screen app generator.
//
// Left side  = Control Panel (inputs).
// Right side = Live Preview that reacts in real time and walks through the
// entire client booking → staff dashboard flow.
//
// The preview enforces the Luxury Pivot styling rules:
//   - bg-neutral-50 surfaces, off-black text
//   - Cormorant Garamond (font-serif) for h1/h2
//   - Montserrat (font-sans) for body
//   - Cards: p-10 whitespace, border border-neutral-100 rounded-2xl,
//            shadow-[0_8px_30px_rgb(0,0,0,0.04)]
//   - Brand color piped via CSS var --brand-color
// ═════════════════════════════════════════════════════════════════════════════

type ActiveStep = 'setup' | 'booking-1' | 'booking-2' | 'booking-3' | 'staff-dashboard'
type AppTheme   = 'modern' | 'luxury'

const SERVICES = [
  { id: 'morpheus8', name: 'Morpheus8',             tagline: 'RF Microneedling',   duration: '90 min', price: 800 },
  { id: 'hydrafacial', name: 'Signature HydraFacial', tagline: 'Skin resurfacing', duration: '60 min', price: 350 },
  { id: 'botox',     name: 'Botox — Full Face',      tagline: 'Preventative care', duration: '45 min', price: 650 },
]

const SLOTS = [
  { day: 'Thu, Apr 23', times: ['10:00 AM', '1:30 PM', '3:00 PM'] },
  { day: 'Fri, Apr 24', times: ['11:00 AM', '2:00 PM', '4:30 PM'] },
  { day: 'Sat, Apr 25', times: ['9:30 AM',  '12:00 PM'] },
]

// ─── Utilities ───────────────────────────────────────────────────────────────

function isLightColor(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // Perceived brightness; >160 ≈ light, use dark text
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

// ═════════════════════════════════════════════════════════════════════════════
// Main
// ═════════════════════════════════════════════════════════════════════════════

export default function InteractiveDemo({
  onGoToPricing,
  onToast,
}: {
  onGoToPricing: () => void
  onToast: (message: string, tone?: 'success' | 'info') => void
}) {
  const [businessName, setBusinessName] = useState('Wellness Co')
  const [brandColor,   setBrandColor]   = useState('#7a5c3b')
  const [appTheme,     setAppTheme]     = useState<AppTheme>('luxury')
  const [activeStep,   setActiveStep]   = useState<ActiveStep>('setup')

  const [selectedService, setSelectedService] = useState<typeof SERVICES[number] | null>(null)
  const [selectedSlot,    setSelectedSlot]    = useState<{ day: string; time: string } | null>(null)
  const [clientName,      setClientName]      = useState('Emma Hayes')
  const [clientEmail,     setClientEmail]     = useState('emma.hayes@gmail.com')

  function handleGenerate() {
    setActiveStep('booking-1')
  }

  function handleConfirm() {
    onToast(`Booking confirmed — ${selectedService?.name} with ${businessName}.`, 'success')
    setActiveStep('staff-dashboard')
  }

  function handleReset() {
    setActiveStep('setup')
    setSelectedService(null)
    setSelectedSlot(null)
  }

  const brandTextColor = isLightColor(brandColor) ? '#1a1a1a' : '#ffffff'

  // CSS variable so the preview can consume the brand color via var(--brand-color)
  const previewStyle: React.CSSProperties = {
    ['--brand-color' as any]: brandColor,
    ['--brand-text'  as any]: brandTextColor,
  }

  return (
    <div className="min-h-screen">
      {/* Luxury hero header */}
      <section className="bg-neutral-50 px-8 lg:px-16 pt-16 lg:pt-24 pb-8">
        <div className="max-w-5xl">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.25em] mb-5">Design Your App</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-[1.1] tracking-tight mb-5">
            Build it now.<br />
            Watch it come to life.
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed max-w-2xl font-light">
            Enter your practice name, pick your brand color, and we'll generate a live preview
            of the exact experience your clients will see. No signup required.
          </p>
        </div>
      </section>

      {/* Split screen */}
      <section className="px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ─── Left: Control Panel ───────────────────────────────────── */}
            <div className="lg:col-span-4 bg-white border border-neutral-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:sticky lg:top-8">
              <div className="mb-7">
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2">Control Panel</p>
                <h3 className="font-serif text-2xl text-neutral-900 tracking-tight">Your brand settings</h3>
              </div>

              {/* Business Name */}
              <div className="mb-6">
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl text-sm text-neutral-900 placeholder-neutral-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  placeholder="Your Practice"
                />
              </div>

              {/* Brand Color */}
              <div className="mb-6">
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2.5">
                  Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={e => setBrandColor(e.target.value)}
                      className="w-12 h-12 rounded-2xl border border-neutral-100 cursor-pointer appearance-none bg-transparent p-0 overflow-hidden"
                      style={{ backgroundColor: brandColor }}
                    />
                  </div>
                  <input
                    type="text"
                    value={brandColor}
                    onChange={e => {
                      const v = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                      setBrandColor(v.slice(0, 7))
                    }}
                    className="flex-1 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm text-neutral-900 font-mono uppercase px-4 py-3 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div className="flex gap-1.5 mt-3">
                  {['#7a5c3b', '#0c1a2e', '#5d7c5d', '#8e2d3b', '#d4a574', '#1a1a1a'].map(c => (
                    <button
                      key={c}
                      onClick={() => setBrandColor(c)}
                      className="w-7 h-7 rounded-lg border border-neutral-100 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                      aria-label={`Use ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* App Theme */}
              <div className="mb-7">
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2.5">
                  App Theme
                </label>
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 border border-neutral-100 rounded-2xl p-1">
                  {(['modern', 'luxury'] as AppTheme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setAppTheme(t)}
                      className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                        appTheme === t
                          ? 'bg-white text-neutral-900 shadow-[0_2px_8px_rgb(0,0,0,0.04)]'
                          : 'text-neutral-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2 font-light">
                  {appTheme === 'luxury'
                    ? 'Cormorant display headings, generous whitespace.'
                    : 'Sans-serif throughout, tighter spacing.'}
                </p>
              </div>

              {/* Action buttons */}
              {activeStep === 'setup' ? (
                <button
                  onClick={handleGenerate}
                  className="w-full font-semibold text-sm rounded-2xl py-4 transition-all hover:opacity-90"
                  style={{ backgroundColor: brandColor, color: brandTextColor }}
                >
                  Generate My App →
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full font-medium text-sm text-neutral-700 border border-neutral-200 rounded-2xl py-3.5 hover:bg-neutral-50 transition-colors"
                >
                  Start Over
                </button>
              )}

              {/* Step indicator */}
              <div className="mt-7 pt-6 border-t border-neutral-100">
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-3">Preview</p>
                <div className="space-y-2">
                  {[
                    { id: 'setup',           label: 'Setup' },
                    { id: 'booking-1',       label: 'Client booking' },
                    { id: 'staff-dashboard', label: 'Staff dashboard' },
                  ].map(s => {
                    const reached =
                      (s.id === 'setup') ||
                      (s.id === 'booking-1' && activeStep !== 'setup') ||
                      (s.id === 'staff-dashboard' && activeStep === 'staff-dashboard')
                    const current =
                      (s.id === 'setup' && activeStep === 'setup') ||
                      (s.id === 'booking-1' && (activeStep === 'booking-1' || activeStep === 'booking-2' || activeStep === 'booking-3')) ||
                      (s.id === 'staff-dashboard' && activeStep === 'staff-dashboard')
                    return (
                      <div key={s.id} className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${
                          current ? 'bg-neutral-900' : reached ? 'bg-neutral-400' : 'bg-neutral-200'
                        }`} />
                        <span className={`text-xs ${current ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ─── Right: Live Preview ───────────────────────────────────── */}
            <div className="lg:col-span-8">
              <div
                className="bg-neutral-50 border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                style={previewStyle}
              >
                {/* Browser chrome strip */}
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white border-b border-neutral-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[11px] text-neutral-400 tracking-wide font-light">
                      {businessName.toLowerCase().replace(/\s+/g, '')}.bridgewayapps.com
                    </span>
                  </div>
                </div>

                <div className="min-h-[640px] relative">
                  {activeStep === 'setup' && (
                    <SetupPreview businessName={businessName} brandColor={brandColor} appTheme={appTheme} />
                  )}
                  {(activeStep === 'booking-1' || activeStep === 'booking-2' || activeStep === 'booking-3') && (
                    <BookingFlow
                      step={activeStep}
                      appTheme={appTheme}
                      businessName={businessName}
                      selectedService={selectedService}
                      setSelectedService={(s) => { setSelectedService(s); setActiveStep('booking-2') }}
                      selectedSlot={selectedSlot}
                      setSelectedSlot={(s) => { setSelectedSlot(s); setActiveStep('booking-3') }}
                      clientName={clientName}
                      setClientName={setClientName}
                      clientEmail={clientEmail}
                      setClientEmail={setClientEmail}
                      onBack={() => {
                        if (activeStep === 'booking-2') setActiveStep('booking-1')
                        if (activeStep === 'booking-3') setActiveStep('booking-2')
                      }}
                      onConfirm={handleConfirm}
                    />
                  )}
                  {activeStep === 'staff-dashboard' && (
                    <StaffDashboardPreview
                      businessName={businessName}
                      selectedService={selectedService}
                      selectedSlot={selectedSlot}
                      clientName={clientName}
                    />
                  )}
                </div>
              </div>

              {/* Big CTA under the preview */}
              <div className="mt-6 bg-neutral-900 rounded-3xl px-8 lg:px-12 py-10 text-center">
                <h3 className="font-serif text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-3">
                  Get this exact setup<br className="hidden sm:block" /> running on your domain today.
                </h3>
                <p className="text-sm text-neutral-400 font-light max-w-xl mx-auto mb-7">
                  Same experience, your brand, your clients. Personally onboarded in under 48 hours.
                </p>
                <button
                  onClick={onGoToPricing}
                  className="inline-flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold rounded-2xl px-7 py-3.5 hover:bg-neutral-100 transition-colors"
                >
                  Continue to Pricing
                  <span>→</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Preview: Setup state (before Generate)
// ═════════════════════════════════════════════════════════════════════════════

function SetupPreview({ businessName, brandColor, appTheme }: {
  businessName: string
  brandColor: string
  appTheme: AppTheme
}) {
  const brandTextColor = isLightColor(brandColor) ? '#1a1a1a' : '#ffffff'
  const headingFont = appTheme === 'luxury' ? 'font-serif' : 'font-sans'
  const headingWeight = appTheme === 'luxury' ? 'font-normal' : 'font-semibold'

  return (
    <div className="p-10 lg:p-14 bg-neutral-50 animate-fade-in-soft">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: brandColor }}
          >
            <svg className="w-5 h-5" style={{ color: brandTextColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
          </div>
          <div>
            <p className={`${headingFont} ${headingWeight} text-xl text-neutral-900 leading-none tracking-wide`}>
              {businessName || 'Your Practice'}
            </p>
            <p className="text-[10px] text-neutral-400 mt-1.5 tracking-[0.2em] uppercase">Client Portal</p>
          </div>
        </div>

        {/* Hero */}
        <h1 className={`${headingFont} ${headingWeight} text-3xl lg:text-[40px] text-neutral-900 leading-[1.1] tracking-tight mb-4`}>
          Welcome.<br />
          Your next visit, made simple.
        </h1>
        <p className="text-sm lg:text-base text-neutral-500 leading-relaxed font-light mb-8">
          Press the button below to preview how your clients will book, check in,
          and return to {businessName || 'your practice'}.
        </p>

        {/* Primary CTA styled with brand */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 mb-6">
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-4">Ready when you are</p>
          <h3 className={`${headingFont} ${headingWeight} text-2xl text-neutral-900 mb-3 tracking-tight`}>
            Press "Generate My App" on the left
          </h3>
          <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6">
            We'll walk through a live booking flow, styled entirely in your colors, in front of your eyes.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-xl py-3 text-center text-sm font-semibold"
              style={{ backgroundColor: brandColor, color: brandTextColor }}
            >
              Book Now (preview)
            </div>
            <div className="rounded-xl border border-neutral-200 py-3 px-5 text-sm font-medium text-neutral-600">
              Sign in
            </div>
          </div>
        </div>

        <p className="text-[11px] text-neutral-400 text-center font-light">
          Everything below reflects your settings on the left. Try changing the color.
        </p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Preview: 3-screen booking flow
// ═════════════════════════════════════════════════════════════════════════════

function BookingFlow({
  step, appTheme, businessName,
  selectedService, setSelectedService,
  selectedSlot, setSelectedSlot,
  clientName, setClientName,
  clientEmail, setClientEmail,
  onBack, onConfirm,
}: {
  step: 'booking-1' | 'booking-2' | 'booking-3'
  appTheme: AppTheme
  businessName: string
  selectedService: typeof SERVICES[number] | null
  setSelectedService: (s: typeof SERVICES[number]) => void
  selectedSlot: { day: string; time: string } | null
  setSelectedSlot: (s: { day: string; time: string }) => void
  clientName: string
  setClientName: (s: string) => void
  clientEmail: string
  setClientEmail: (s: string) => void
  onBack: () => void
  onConfirm: () => void
}) {
  const headingFont = appTheme === 'luxury' ? 'font-serif' : 'font-sans'
  const headingWeight = appTheme === 'luxury' ? 'font-normal' : 'font-semibold'

  return (
    <div key={step} className="p-10 lg:p-14 bg-neutral-50 animate-fade-in-soft min-h-[640px]">
      <div className="max-w-xl mx-auto">

        {/* Business header */}
        <div className="text-center mb-10">
          <p className={`${headingFont} ${headingWeight} text-lg text-neutral-900 tracking-wide`}>{businessName || 'Your Practice'}</p>
          <p className="text-[10px] text-neutral-400 mt-1 tracking-[0.2em] uppercase">Book an Appointment</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map(n => {
            const currentN = step === 'booking-1' ? 1 : step === 'booking-2' ? 2 : 3
            const active = n <= currentN
            return (
              <div key={n} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--brand-color)' : '#f5f5f4',
                    color:           active ? 'var(--brand-text)'  : '#a3a3a3',
                  }}
                >
                  {n}
                </div>
                {n < 3 && <div className="w-8 h-[1px] bg-neutral-200" />}
              </div>
            )
          })}
        </div>

        {/* Screen 1: Service */}
        {step === 'booking-1' && (
          <div className="animate-fade-in">
            <h2 className={`${headingFont} ${headingWeight} text-3xl lg:text-4xl text-neutral-900 tracking-tight text-center mb-3`}>
              What service can we provide?
            </h2>
            <p className="text-sm text-neutral-400 text-center font-light mb-10">
              Select from our signature treatments.
            </p>

            <div className="space-y-3">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-left transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className={`${headingFont} ${headingWeight} text-xl text-neutral-900 tracking-tight`}>
                        {s.name}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-light">{s.tagline} · {s.duration}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`${headingFont} ${headingWeight} text-2xl text-neutral-900 tabular-nums tracking-tight`}>
                        ${s.price}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 tracking-wider uppercase">per visit</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 2: Date / time */}
        {step === 'booking-2' && (
          <div className="animate-fade-in">
            <h2 className={`${headingFont} ${headingWeight} text-3xl lg:text-4xl text-neutral-900 tracking-tight text-center mb-3`}>
              When would you like to come in?
            </h2>
            <p className="text-sm text-neutral-400 text-center font-light mb-10">
              {selectedService?.name} · {selectedService?.duration}
            </p>

            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-6">
              {SLOTS.map(d => (
                <div key={d.day}>
                  <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-3">{d.day}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {d.times.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedSlot({ day: d.day, time: t })}
                        className="py-3 rounded-xl border border-neutral-100 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-900 hover:bg-neutral-50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={onBack}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                ← Back to services
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Confirm */}
        {step === 'booking-3' && (
          <div className="animate-fade-in">
            <h2 className={`${headingFont} ${headingWeight} text-3xl lg:text-4xl text-neutral-900 tracking-tight text-center mb-3`}>
              Who are we expecting?
            </h2>
            <p className="text-sm text-neutral-400 text-center font-light mb-10">
              One final step. Then you're booked.
            </p>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-6">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-100">
                <div>
                  <p className={`${headingFont} ${headingWeight} text-2xl text-neutral-900 tracking-tight`}>
                    {selectedService?.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 font-light">{selectedService?.tagline}</p>
                </div>
                <p className={`${headingFont} ${headingWeight} text-2xl text-neutral-900 tabular-nums`}>
                  ${selectedService?.price}
                </p>
              </div>

              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-light">When</span>
                  <span className="text-neutral-800">{selectedSlot?.day} · {selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-light">Duration</span>
                  <span className="text-neutral-800">{selectedService?.duration}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2">Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="w-full font-semibold text-sm rounded-2xl py-4 transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-color)', color: 'var(--brand-text)' }}
            >
              Confirm Booking
            </button>

            <div className="text-center mt-5">
              <button
                onClick={onBack}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                ← Back to time
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Preview: Staff Dashboard (after confirm)
// ═════════════════════════════════════════════════════════════════════════════

function StaffDashboardPreview({
  businessName,
  selectedService,
  selectedSlot,
  clientName,
}: {
  businessName: string
  selectedService: typeof SERVICES[number] | null
  selectedSlot: { day: string; time: string } | null
  clientName: string
}) {
  const [highlight, setHighlight] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setHighlight(false), 3500)
    return () => clearTimeout(t)
  }, [])

  const todayRevenue = 4200
  const bookingPrice = selectedService?.price || 0

  return (
    <div className="p-10 lg:p-14 bg-neutral-50 animate-fade-in-soft">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em]">{businessName || 'Your Practice'}</p>
            <h2 className="font-serif text-3xl text-neutral-900 tracking-tight mt-1">Front Desk</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-700 font-medium tracking-wide">Live</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em]">Today's Revenue</p>
            <p className="font-serif text-3xl text-neutral-900 tabular-nums mt-3 tracking-tight">
              ${(todayRevenue + bookingPrice).toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-600 mt-1 font-medium">+${bookingPrice} just booked</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em]">Appointments</p>
            <p className="font-serif text-3xl text-neutral-900 tabular-nums mt-3 tracking-tight">9</p>
            <p className="text-[10px] text-neutral-400 mt-1 font-light">2 pending confirmation</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em]">Active Clients</p>
            <p className="font-serif text-3xl text-neutral-900 tabular-nums mt-3 tracking-tight">184</p>
            <p className="text-[10px] text-neutral-400 mt-1 font-light">12 new this month</p>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-8 pt-7 pb-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-serif text-xl text-neutral-900 tracking-tight">Upcoming Appointments</h3>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">This week</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {/* Just-booked entry — animated highlight */}
            <div
              className={`px-8 py-5 transition-colors ${highlight ? 'bg-emerald-50/40' : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: 'var(--brand-color)', color: 'var(--brand-text)' }}
                  >
                    {clientName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{clientName}</p>
                      {highlight && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-emerald-500 text-white tracking-wide">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 font-light">
                      {selectedService?.name || 'Service'} · {selectedSlot?.day || 'Upcoming'} · {selectedSlot?.time || ''}
                    </p>
                  </div>
                </div>
                <p className="font-serif text-lg text-neutral-900 tabular-nums tracking-tight flex-shrink-0">
                  ${selectedService?.price || 0}
                </p>
              </div>
            </div>

            {/* Static upcoming rows */}
            {[
              { name: 'Olivia Chen',    svc: 'Morpheus8',          day: 'Thu, Apr 23', time: '3:00 PM',  price: 800 },
              { name: 'Sofia Ramirez',  svc: 'Signature HydraFacial', day: 'Fri, Apr 24', time: '11:00 AM', price: 350 },
              { name: 'Mia Patel',      svc: 'Botox — Full Face',  day: 'Fri, Apr 24', time: '2:00 PM',  price: 650 },
              { name: 'Grace Thompson', svc: 'Morpheus8',          day: 'Sat, Apr 25', time: '12:00 PM', price: 800 },
            ].map((a, i) => (
              <div key={i} className="px-8 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-xs font-semibold">
                      {a.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{a.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 font-light">{a.svc} · {a.day} · {a.time}</p>
                    </div>
                  </div>
                  <p className="font-serif text-lg text-neutral-900 tabular-nums tracking-tight flex-shrink-0">${a.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-neutral-400 text-center font-light mt-8">
          This is a preview — in your real dashboard, this updates every time a client books, checks in, or pays.
        </p>
      </div>
    </div>
  )
}
