import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function QuickClientLookup() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)
  // Generation counter — each new search increments this. Any response that
  // arrives after a newer search has started is discarded (stale race condition).
  const genRef = useRef(0)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const gen = ++genRef.current
      try {
        const { data } = await supabase
          .from('clients')
          .select('id, name, email, phone')
          .eq('org_id', profile.org_id)
          .ilike('name', `%${query}%`)
          .limit(5)

        if (gen !== genRef.current) return  // stale — a newer search is in flight
        setResults(data || [])
      } catch {
        if (gen !== genRef.current) return
        setResults([])
      } finally {
        if (gen === genRef.current) {
          setSearched(true)
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, profile?.org_id])

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a name to search..."
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 placeholder-gray-600 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results */}
      {!query.trim() && (
        <p className="text-gray-600 text-sm text-center py-2">Type a name to search</p>
      )}

      {searched && !loading && results.length === 0 && query.trim() && (
        <p className="text-gray-500 text-sm text-center py-2">No clients found</p>
      )}

      {results.length > 0 && (
        <div className="space-y-1">
          {results.map(client => (
            <button
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              className="w-full text-left p-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
            >
              <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">
                {client.name}
              </p>
              <div className="flex gap-3 mt-0.5">
                {client.email && (
                  <p className="text-xs text-gray-500 truncate">{client.email}</p>
                )}
                {client.phone && (
                  <p className="text-xs text-gray-500 flex-shrink-0">{client.phone}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
