import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import EmptyState from '../components/EmptyState'

export default function Announcements() {
  const { profile } = useAuth()
  const role = profile?.role ?? 'staff'
  const isManager = role === 'admin' || role === 'manager'

  const [announcements, setAnnouncements] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchAnnouncements()
  }, [profile?.org_id])

  async function fetchAnnouncements() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await supabase
        .from('announcements')
        .select('id, message, posted_at, profiles(full_name)')
        .eq('org_id', profile.org_id)
        .order('posted_at', { ascending: false })
        .limit(20)
      setAnnouncements(data || [])
    } catch {
      setError(true)
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  async function addAnnouncement() {
    const message = inputText.trim()
    if (!message) return
    try {
      await supabase
        .from('announcements')
        .insert({ org_id: profile.org_id, message, posted_by: profile.id })
      setInputText('')
      await fetchAnnouncements()
    } catch {
      // silent — input preserved so user can retry
    }
  }

  async function removeAnnouncement(id) {
    try {
      await supabase
        .from('announcements')
        .delete()
        .eq('id', id)
        .eq('org_id', profile.org_id)
      await fetchAnnouncements()
    } catch {
      // silent
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addAnnouncement()
    }
  }

  return (
    <div className="space-y-3">
      {/* Manager-only compose area */}
      {isManager && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Post an announcement..."
            className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20"
          />
          <button
            onClick={addAnnouncement}
            disabled={!inputText.trim()}
            className="px-3 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      )}

      {/* Announcements list */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400/70 text-sm text-center py-4">Unable to load — try refreshing</p>
      ) : announcements.length === 0 ? (
        <EmptyState icon="bell" title="No announcements" message="Announcements from managers will appear here." />
      ) : (
        <div className="space-y-2">
          {announcements.map(ann => {
            const dt = new Date(ann.posted_at)
            const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            return (
              <div key={ann.id} className="p-2.5 rounded-lg bg-gray-800/50 group relative">
                <p className="text-sm text-white pr-6">{ann.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {ann.profiles?.full_name || 'Staff'} · {timeStr}
                </p>
                {isManager && (
                  <button
                    onClick={() => removeAnnouncement(ann.id)}
                    className="absolute top-2.5 right-2.5 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
