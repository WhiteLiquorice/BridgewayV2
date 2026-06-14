import React, { useState } from 'react';

// Error Boundary wrapper for file type validation and safety
class FileErrorBoundary extends React.Component<{ children: React.ReactNode; onError: (error: string) => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    this.props.onError(error.message || "Failed parsing sheet contents.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 text-center">
          <p className="font-semibold">Interactive parser encountered a parsing failure.</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg"
          >
            Reset Parser
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function JumpingShip() {
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileImported, setFileImported] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  
  // Headers auto-detected from dropped sheet
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  // Local mapping selections mapping Bridgeway target fields -> dropped sheet headers
  const [mappings, setMappings] = useState<Record<string, string>>({
    clientName: '',
    historicNotes: '',
    treatmentHistory: '',
    productCount: ''
  });

  const TARGET_FIELDS = [
    { key: 'clientName', label: 'Client Name', description: 'Roster full name or display name' },
    { key: 'historicNotes', label: 'Historic Notes', description: 'Patient records and warnings' },
    { key: 'treatmentHistory', label: 'Treatment History', description: 'Past appointments and logs' },
    { key: 'productCount', label: 'Product Count', description: 'Number of purchases / stock count' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    const isCsv = file.name.endsWith('.csv');
    const isXlsx = file.name.endsWith('.xlsx');

    if (!isCsv && !isXlsx) {
      throw new Error(`MIME-Type mismatch: "${file.type || 'unknown'}". Bridgeway only accepts structured .csv or .xlsx client spreadsheets.`);
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    
    // Simulate reading mock headers based on file name or generic preset
    const mockHeaders = isCsv 
      ? ['Full Name', 'Roster Contact', 'Pat Notes', 'Past Procedures', 'Retail Vol', 'Last Visited']
      : ['Client_Name_ID', 'Roster_Mail', 'Clinic_Remarks', 'Log_Interventions', 'Inventory_Sales'];

    setSourceHeaders(mockHeaders);
    
    // Auto-detect mappings headlessly
    setMappings({
      clientName: mockHeaders.find(h => /name/i.test(h)) || mockHeaders[0] || '',
      historicNotes: mockHeaders.find(h => /note|remark/i.test(h)) || mockHeaders[2] || '',
      treatmentHistory: mockHeaders.find(h => /procedure|log|intervention/i.test(h)) || mockHeaders[3] || '',
      productCount: mockHeaders.find(h => /vol|sale|inventory/i.test(h)) || mockHeaders[4] || ''
    });

    setFileImported(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      try {
        processFile(e.dataTransfer.files[0]);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      try {
        processFile(e.target.files[0]);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleMappingChange = (fieldKey: string, headerVal: string) => {
    setMappings(prev => ({ ...prev, [fieldKey]: headerVal }));
  };

  const handleReset = () => {
    setFileImported(false);
    setFileName('');
    setSourceHeaders([]);
    setError(null);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] font-sans text-neutral-800">
      <div className="mb-6">
        <h2 className="font-serif text-3xl text-neutral-900 leading-tight">Jumping Ship</h2>
        <p className="text-sm text-neutral-500 mt-2 font-light">
          Migrate your client records from Mindbody, Jane, or Boulevard in seconds. Drag and drop your roster sheet below to preview column alignments.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 items-start text-rose-800">
          <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold">File Ingestion Failed</p>
            <p className="text-xs text-rose-600 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <FileErrorBoundary onError={(msg) => setError(msg)}>
        {!fileImported ? (
          /* Drag and Drop Zone */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-amber-500 bg-amber-50/20 shadow-md' 
                : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50'
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              multiple={false} 
              accept=".csv, .xlsx"
              onChange={handleChange}
              className="hidden" 
              aria-label="Roster spreadsheet uploader"
            />
            
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-base font-semibold text-neutral-900 block hover:text-amber-600 transition-colors">
                Drag and Drop Client Roster Here
              </span>
              <span className="text-xs text-neutral-400 mt-1 block">
                Supports standard .csv or .xlsx sheets (Max 50MB)
              </span>
            </label>

            <button 
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="mt-6 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm"
            >
              Browse Files
            </button>
          </div>
        ) : (
          /* Headless Alignment Mapping View */
          <div className="space-y-8 animate-fade-in">
            {/* File Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{fileName}</p>
                  <p className="text-[11px] text-neutral-400">{fileSize}</p>
                </div>
              </div>
              <button 
                onClick={handleReset}
                className="text-xs text-neutral-400 hover:text-neutral-900 font-semibold transition-colors"
              >
                Clear Sheet
              </button>
            </div>

            {/* Column Mapper Grid */}
            <div className="border border-neutral-200/60 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200/60">
                <h3 className="text-sm font-bold text-neutral-900">Map Columns to Bridgeway Database</h3>
                <p className="text-xs text-neutral-400 mt-1 font-light">Align your spreadsheet headers with our target schemas.</p>
              </div>

              <div className="divide-y divide-neutral-100">
                {TARGET_FIELDS.map((field) => (
                  <div key={field.key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/30 transition-colors">
                    <div className="max-w-md">
                      <span className="text-sm font-semibold text-neutral-900 block">{field.label}</span>
                      <span className="text-xs text-neutral-400 mt-0.5 font-light block">{field.description}</span>
                    </div>

                    <div className="w-full md:w-64">
                      <select
                        value={mappings[field.key]}
                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                        aria-label={`Map ${field.label} to column`}
                      >
                        <option value="">Select column header...</option>
                        {sourceHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Parsing Mapping Grid Mock-up */}
            <div className="border border-neutral-200/60 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200/60">
                <h3 className="text-sm font-bold text-neutral-900">Parsing Preview (Interactive Roster Schema)</h3>
                <p className="text-xs text-neutral-400 mt-1 font-light">Calculated client profile records mapped directly from current column selections.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/30 border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Client Name</th>
                      <th className="px-6 py-3">Historic Notes</th>
                      <th className="px-6 py-3">Treatment History</th>
                      <th className="px-6 py-3 text-right">Product Count</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-neutral-700 divide-y divide-neutral-100 font-mono">
                    {[
                      { name: 'Emma Hayes', notes: 'Allergic to lavender extracts.', history: 'Morpheus8 RF treatment', count: '14 units' },
                      { name: 'David Mercer', notes: 'Requires high-contrast room settings.', history: 'Therapeutic Massage', count: '8 units' },
                      { name: 'Sofia Rodriguez', notes: 'Prefers silent appointments.', history: 'Signature HydraFacial', count: '24 units' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-neutral-900 font-sans">{mappings.clientName ? row.name : '—'}</td>
                        <td className="px-6 py-4 font-light text-neutral-500 font-sans max-w-xs truncate">{mappings.historicNotes ? row.notes : '—'}</td>
                        <td className="px-6 py-4 font-light text-neutral-500 font-sans">{mappings.treatmentHistory ? row.history : '—'}</td>
                        <td className="px-6 py-4 text-right font-medium text-neutral-900 font-sans">{mappings.productCount ? row.count : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center text-white space-y-4">
              <h3 className="text-lg font-serif text-white font-medium">Verify sandbox configurations</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto">
                Once satisfied with column mappings, you can initialize a live production sandbox with this roster mapped cleanly.
              </p>
              <button
                type="button"
                onClick={() => alert('Sandbox initialized successfully!')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-amber-500/10 cursor-pointer"
              >
                Launch Custom Clinic Sandbox (60s)
              </button>
            </div>
          </div>
        )}
      </FileErrorBoundary>
    </div>
  );
}
