import { useState, useEffect } from 'react';
import './App.css';

interface CallTurn {
  role: 'caller' | 'sharon';
  text: string;
  timestamp: string;
}

interface CallRecord {
  callSid: string;
  from: string;
  status: 'ringing' | 'in_progress' | 'completed' | 'failed';
  turns: CallTurn[];
  createdAt: string;
  updatedAt: string;
  callerName?: string | null;
  callerEmail?: string | null;
  callerPhone?: string | null;
  callPurpose?: string | null;
  summaryNotes?: string | null;
}

// Mock calls populated to verify UI out-of-the-box when Firebase is not connected
const MOCK_CALLS: CallRecord[] = [
  {
    callSid: "CA11111111111111111111111111111111",
    from: "+15550199",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    callerName: "Robert Downey",
    callerEmail: "robert@rdjholdings.com",
    callerPhone: "+15550199",
    callPurpose: "Schedule an urgent strategic consulting session with Bridgeway leadership.",
    summaryNotes: "- Caller wanted to book a consult session.\n- Prefers next Thursday afternoon.\n- Instructed to send invite links to robert@rdjholdings.com.",
    turns: [
      { role: "sharon", text: "Hello, thank you for calling. I am Sharon, your virtual assistant. How can I help you today?", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { role: "caller", text: "Hi Sharon, this is Robert Downey. I'd like to book an appointment next Thursday afternoon if possible.", timestamp: new Date(Date.now() - 3590000 * 2).toISOString() },
      { role: "sharon", text: "I can help with that, Robert. What is the best email and phone number to send the confirmation to?", timestamp: new Date(Date.now() - 3580000 * 2).toISOString() },
      { role: "caller", text: "Sure, my email is robert at rdjholdings dot com and my number is this one.", timestamp: new Date(Date.now() - 3570000 * 2).toISOString() },
      { role: "sharon", text: "Perfect, I have noted that down. I will let the team know to schedule a consultation for next Thursday afternoon. Thank you for calling!", timestamp: new Date(Date.now() - 3560000 * 2).toISOString() }
    ]
  },
  {
    callSid: "CA22222222222222222222222222222222",
    from: "+15550244",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    callerName: "Sarah Connor",
    callerEmail: "sconnor@resistance.net",
    callerPhone: "+15550244",
    callPurpose: "Inquire about software onboarding timelines and API documentation access.",
    summaryNotes: "- Sarah asked about the standard setup timeline.\n- Needs access to the API sandbox documents.\n- Action Item: Developer to email docs.",
    turns: [
      { role: "sharon", text: "Hello, thank you for calling. I am Sharon, your virtual assistant. How can I help you today?", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { role: "caller", text: "Hello, I wanted to check what the standard setup time is for the Bridgeway portal, and if I can get API docs.", timestamp: new Date(Date.now() - 3590000 * 5).toISOString() },
      { role: "sharon", text: "Onboarding typically takes 1 to 2 business days. I can request our engineering team to email you the API documents. What is your email address?", timestamp: new Date(Date.now() - 3580000 * 5).toISOString() },
      { role: "caller", text: "My email is sconnor at resistance dot net.", timestamp: new Date(Date.now() - 3570000 * 5).toISOString() },
      { role: "sharon", text: "Thank you. I have logged that request. We will email the documents shortly. Goodbye!", timestamp: new Date(Date.now() - 3560000 * 5).toISOString() }
    ]
  }
];

export default function App() {
  const [calls, setCalls] = useState<CallRecord[]>(MOCK_CALLS);
  const [selectedCallSid, setSelectedCallSid] = useState<string | null>(MOCK_CALLS[0]?.callSid || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtered Calls list
  const filteredCalls = calls.filter(c => {
    const matchesSearch = 
      (c.callerName && c.callerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.from.includes(searchQuery) ||
      (c.callPurpose && c.callPurpose.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedCall = calls.find(c => c.callSid === selectedCallSid);

  // Load from database if configured (simulating fetch)
  useEffect(() => {
    const fetchCalls = async () => {
      setIsLoading(true);
      try {
        // In production, this would query Firebase Firestore collections
        // For the standalone app demo, we load the mock data array
        setCalls(MOCK_CALLS);
      } catch (err) {
        const error = err as Error;
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalls();
  }, []);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    try {
      const headers = ["Call SID", "Caller Name", "Caller Phone", "Caller Email", "Call Purpose", "Secretary Notes", "Status", "Date"];
      const rows = calls.map(c => [
        c.callSid,
        c.callerName || "Unknown",
        c.callerPhone || c.from,
        c.callerEmail || "N/A",
        `"${(c.callPurpose || "").replace(/"/g, '""')}"`,
        `"${(c.summaryNotes || "").replace(/"/g, '""')}"`,
        c.status,
        new Date(c.createdAt).toLocaleString()
      ]);

      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sharon_calls_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed:", err);
    }
  };

  return (
    <div className="sharon-container">
      {/* Top Navbar */}
      <header className="sharon-navbar">
        <div className="brand-group">
          <div className="brand-logo">🎙️</div>
          <div className="brand-text">
            <h1>SHARON</h1>
            <span>AI Voice Secretary</span>
          </div>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            Export all logs (CSV)
          </button>
        </div>
      </header>

      {/* Main Board Grid */}
      <div className="sharon-board">
        {/* Sidebar Calls List */}
        <aside className="board-sidebar">
          <div className="sidebar-header">
            <h2>Caller Logs</h2>
            <div className="filter-group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'in_progress')}>
                <option value="all">All Calls</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            <input 
              type="text" 
              placeholder="Search name, phone, purpose..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="calls-list">
            {isLoading ? (
              <div className="loader">Loading calls...</div>
            ) : filteredCalls.length === 0 ? (
              <div className="no-calls">No call logs found</div>
            ) : (
              filteredCalls.map(c => (
                <div 
                  key={c.callSid} 
                  className={`call-card-item ${selectedCallSid === c.callSid ? 'active' : ''}`}
                  onClick={() => setSelectedCallSid(c.callSid)}
                >
                  <div className="call-card-header">
                    <span className="caller-title">{c.callerName || c.from}</span>
                    <span className={`status-pill ${c.status}`}>{c.status}</span>
                  </div>
                  <p className="call-card-purpose">{c.callPurpose || 'No purpose recorded yet.'}</p>
                  <div className="call-card-footer">
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Selected Call Detail Viewer */}
        <main className="board-viewer">
          {errorMessage && (
            <div className="error-panel">Error: {errorMessage}</div>
          )}

          {selectedCall ? (
            <div className="detail-grid">
              
              {/* Call Summary Panel */}
              <section className="detail-left">
                <div className="card call-summary-card">
                  <h2>Secretary Notes</h2>
                  
                  <div className="metadata-grid">
                    <div className="meta-item">
                      <span className="meta-label">Name</span>
                      <span className="meta-value">{selectedCall.callerName || 'Unknown'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Email</span>
                      <span className="meta-value">{selectedCall.callerEmail || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Phone</span>
                      <span className="meta-value">{selectedCall.callerPhone || selectedCall.from}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Date / Time</span>
                      <span className="meta-value">{new Date(selectedCall.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="summary-block">
                    <h3>Purpose of Call</h3>
                    <p className="purpose-text">{selectedCall.callPurpose || 'Sharon is currently extracting purpose...'}</p>
                  </div>

                  <div className="summary-block">
                    <h3>Notes Summary & Action Items</h3>
                    <div className="notes-text">
                      {selectedCall.summaryNotes ? (
                        selectedCall.summaryNotes.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))
                      ) : (
                        <p className="placeholder-notes">Waiting for call to complete to generate summaries.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Call Transcript Panel */}
              <section className="detail-right">
                <div className="card transcript-card">
                  <h2>Call Dialogue Transcript</h2>
                  
                  <div className="transcript-chat">
                    {selectedCall.turns.length === 0 ? (
                      <p className="no-turns">Call started. Awaiting conversation.</p>
                    ) : (
                      selectedCall.turns.map((turn, idx) => (
                        <div key={idx} className={`chat-bubble-row ${turn.role}`}>
                          <div className="chat-bubble-speaker">{turn.role === 'sharon' ? 'Sharon (AI Assistant)' : 'Caller'}</div>
                          <div className="chat-bubble-text">{turn.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

            </div>
          ) : (
            <div className="viewer-placeholder">
              <span className="placeholder-logo">🎙️</span>
              <p>Select a call from the sidebar logs to view transcripts and secretary notes.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
