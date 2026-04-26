import { useState } from 'react'
import { createPortal } from 'react-dom'

const STEPS = [
  {
    title: 'Welcome to Bridgeway',
    description: 'Let\u2019s get your practice set up in a few quick steps.',
    icon: (
      <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Your Dashboard',
    description: 'The dashboard shows today\u2019s schedule, waiting room, upcoming bookings, and more. You can drag widgets to rearrange them by clicking "Edit Layout".',
    icon: (
      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: 'Quick Actions',
    description: 'Press Ctrl+K (or \u2318K) to open the command palette. Use N for a new appointment, C to jump to clients, and ? for all shortcuts.',
    icon: (
      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'You\u2019re all set!',
    description: 'Start by adding your first client or booking an appointment. You can always access the Admin panel to manage services, users, and notifications.',
    icon: (
      <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function OnboardingWizard({ isOpen, onComplete }) {
  const { profile } = useAuth()
  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function handleFinish() {
    // TODO: mark onboarding complete via DataConnect mutation once port is done
    onComplete()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-8 py-10 text-center">
          <div className="flex justify-center mb-6">
            {current.icon}
          </div>
          <h2 className="text-xl font-semibold text-white mb-3">{current.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            {current.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-brand' : i < step ? 'bg-brand/40' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-8 pb-8">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onComplete()}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            {step > 0 ? 'Back' : 'Skip'}
          </button>
          <button
            onClick={isLast ? handleFinish : () => setStep(s => s + 1)}
            className="px-6 py-2.5 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors"
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
