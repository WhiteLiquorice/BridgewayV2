import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

function FileIcon() {
  return (
    <svg className="w-8 h-8 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default function ClientDocuments() {
  const { profile } = useAuth()
  const clientId = profile?.id

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) return
    async function fetchDocs() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('documents')
          .select('*')
          .eq('client_id', clientId)
          .order('uploaded_at', { ascending: false })
        setDocuments(data || [])
      } catch {
        // Network error — leave stale data in place, spinner resolves
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [clientId])

  async function handleDownload(doc) {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 3600)
    if (error) { alert(`Download error: ${error.message}`); return }
    window.open(data.signedUrl, '_blank')
  }

  function formatDate(dt) {
    return new Date(dt).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-white">My Documents</h1>
        <p className="text-sm text-gray-500 mt-0.5">Files shared with you by your provider</p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No documents shared with you yet.</p>
          <p className="text-gray-600 text-sm mt-1">Your provider will upload documents here for you to access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col hover:border-amber-500/20 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  <FileIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate" title={doc.file_name}>{doc.file_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(doc.uploaded_at)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                  onClick={() => handleDownload(doc)}
                  className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
