import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrg } from '../App'

function BigCard({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center gap-5 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] no-select"
    >
      {children}
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const org      = useOrg()
  const accent   = org?.primary_color || '#f59e0b'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-10 py-12">
      {/* Org header */}
      <div className="text-center mb-14">
        {org?.logo_url ? (
          <img src={org.logo_url} alt="" className="w-24 h-24 mx-auto rounded-2xl object-cover mb-6 shadow-sm border border-slate-100" />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-sm"
               style={{ backgroundColor: accent }}>
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        )}
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">{org?.name}</h1>
        <p className="text-slate-500 text-2xl mt-4 font-light">Welcome — how can we help you today?</p>
      </div>

      {/* Three main actions */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Walk In */}
        <BigCard onClick={() => navigate('/walkin')}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: accent + '15' }}>
            <svg className="w-10 h-10" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">Walk In</p>
            <p className="text-slate-500 text-lg mt-2">No appointment — join the queue</p>
          </div>
        </BigCard>

        {/* I Have an Appointment */}
        <BigCard onClick={() => navigate('/checkin')}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: accent + '15' }}>
            <svg className="w-10 h-10" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">I Have an Appointment</p>
            <p className="text-slate-500 text-lg mt-2">Check in with your phone number</p>
          </div>
        </BigCard>

        {/* Schedule a Visit */}
        <BigCard onClick={() => navigate('/schedule')}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: accent + '15' }}>
            <svg className="w-10 h-10" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">Schedule a Visit</p>
            <p className="text-slate-500 text-lg mt-2">Book your next appointment</p>
          </div>
        </BigCard>
      </div>
    </div>
  )
}
