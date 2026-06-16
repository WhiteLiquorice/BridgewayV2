import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createClient, updateClient, getOrgClients } from '@bridgeway/database'
import { dataconnect } from '../lib/firebase'
import { useToast } from '../context/ToastContext'
import { logActivity } from '../lib/logActivity'

interface MappedClient {
  name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  notes: string | null
  status: 'valid' | 'invalid'
  errors: string[]
  duplicateOf?: any
}

const BRIDGEWAY_FIELDS = [
  { key: 'name', label: 'Full Name', required: true, desc: 'Client\'s complete name. If first & last are separate, use First Name / Last Name mapping.' },
  { key: 'first_name', label: 'First Name', required: false, desc: 'Mapped if name is separate.' },
  { key: 'last_name', label: 'Last Name', required: false, desc: 'Mapped if name is separate.' },
  { key: 'email', label: 'Email Address', required: false, desc: 'Unique contact email.' },
  { key: 'phone', label: 'Phone Number', required: false, desc: 'Primary contact number.' },
  { key: 'date_of_birth', label: 'Date of Birth', required: false, desc: 'YYYY-MM-DD format (we\'ll attempt to normalize other formats).' },
  { key: 'address', label: 'Street Address', required: false, desc: 'Mailing / home address.' },
  { key: 'notes', label: 'Notes / Comments', required: false, desc: 'Administrative notes.' },
]

export default function ClientImporter() {
  const { org, profile } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [fileName, setFileName] = useState('')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({}) // bridgewayField -> csvHeader
  const [isDragging, setIsDragging] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStats, setImportStats] = useState({ total: 0, success: 0, failed: 0 })
  const [editedClients, setEditedClients] = useState<MappedClient[] | null>(null)
  const [conflictResolution, setConflictResolution] = useState<'skip' | 'overwrite' | 'merge'>('skip')
  const [failedRows, setFailedRows] = useState<{ row: any; error: string }[]>([])
  const [existingClients, setExistingClients] = useState<any[]>([])

  const orgId = org?.id

  // ── CSV PARSER ─────────────────────────────────────────────────────────────
  function parseCSV(text: string): string[][] {
    const lines: string[][] = []
    let row: string[] = ['']
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const next = text[i + 1]

      if (char === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        row.push('')
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && next === '\n') {
          i++
        }
        lines.push(row)
        row = ['']
      } else {
        row[row.length - 1] += char
      }
    }

    if (row.length > 1 || row[0] !== '') {
      lines.push(row)
    }

    // Filter out completely empty lines
    return lines.filter(r => r.some(cell => cell.trim() !== ''))
  }

  // ── FILE UPLOAD HANDLERS ───────────────────────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      showToast('Please upload a valid CSV file', 'error')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      const parsed = parseCSV(text)
      if (parsed.length < 2) {
        showToast('CSV file must contain a header row and at least one data row', 'error')
        return
      }

      const headers = parsed[0].map(h => h.trim())
      const rows = parsed.slice(1)

      setCsvHeaders(headers)
      setCsvRows(rows)

      // Auto-detect mappings
      const initialMapping: Record<string, string> = {}
      BRIDGEWAY_FIELDS.forEach(field => {
        const match = findMatchingHeader(field.key, headers)
        if (match) initialMapping[field.key] = match
      })
      setMapping(initialMapping)
      setStep(2)
    }
    reader.readAsText(file)
  }

  function findMatchingHeader(key: string, headers: string[]): string | null {
    const searchTerms: Record<string, string[]> = {
      name: ['name', 'full name', 'fullname', 'client name', 'customer name', 'patient name', 'display name'],
      first_name: ['first name', 'firstname', 'first', 'given name', 'fname'],
      last_name: ['last name', 'lastname', 'last', 'surname', 'lname'],
      email: ['email', 'email address', 'email_address', 'mail', 'e-mail'],
      phone: ['phone', 'phone number', 'phone_number', 'mobile', 'cell', 'telephone', 'tel'],
      date_of_birth: ['dob', 'date of birth', 'birthdate', 'birthday', 'birth_date', 'birth date'],
      address: ['address', 'street', 'location', 'billing address', 'home address', 'street address'],
      notes: ['notes', 'comments', 'notes/comments', 'description', 'memo', 'details']
    }

    const terms = searchTerms[key] || []
    for (const header of headers) {
      const normalizedHeader = header.toLowerCase().replace(/[\s_-]/g, '')
      for (const term of terms) {
        const normalizedTerm = term.replace(/[\s_-]/g, '')
        if (normalizedHeader === normalizedTerm || normalizedHeader.includes(normalizedTerm)) {
          return header
        }
      }
    }
    return null
  }

  // ── MAPPING HANDLERS ───────────────────────────────────────────────────────
  function handleMapChange(fieldKey: string, headerValue: string) {
    setMapping(prev => {
      const copy = { ...prev }
      if (headerValue === '') {
        delete copy[fieldKey]
      } else {
        copy[fieldKey] = headerValue
      }
      return copy
    })
  }

  // ── DATE NORMALIZATION ─────────────────────────────────────────────────────
  function normalizeDate(val: string): string | null {
    if (!val) return null
    const cleaned = val.trim()
    if (!cleaned) return null

    // Check if ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned

    // Match MM/DD/YYYY or M/D/YYYY
    const slashMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (slashMatch) {
      const month = slashMatch[1].padStart(2, '0')
      const day = slashMatch[2].padStart(2, '0')
      const year = slashMatch[3]
      return `${year}-${month}-${day}`
    }

    // Match DD-MM-YYYY
    const dashMatch = cleaned.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
    if (dashMatch) {
      const day = dashMatch[1].padStart(2, '0')
      const month = dashMatch[2].padStart(2, '0')
      const year = dashMatch[3]
      return `${year}-${month}-${day}`
    }

    return null // Could not safely normalize, fallback to skip DOB or insert null
  }

  // ── MAP ROWS TO CLIENT OBJECTS ─────────────────────────────────────────────
  function getMappedClients(): MappedClient[] {
    const mapped: MappedClient[] = []

    csvRows.forEach((row, rowIndex) => {
      const getVal = (fieldKey: string): string => {
        const header = mapping[fieldKey]
        if (!header) return ''
        const headerIdx = csvHeaders.indexOf(header)
        return headerIdx !== -1 ? row[headerIdx]?.trim() || '' : ''
      }

      // Determine Name
      let clientName = getVal('name')
      if (!clientName) {
        const firstName = getVal('first_name')
        const lastName = getVal('last_name')
        if (firstName || lastName) {
          clientName = `${firstName} ${lastName}`.trim()
        }
      }

      const email = getVal('email')
      const phone = getVal('phone')
      const rawDob = getVal('date_of_birth')
      const dob = normalizeDate(rawDob)
      const address = getVal('address')
      const notes = getVal('notes')

      const errors: string[] = []
      
      if (!clientName) {
        errors.push('Name field is missing or could not be mapped.')
      }

      let emailVal: string | null = email || null
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(`Invalid email format: "${email}". This field will be skipped.`)
        emailVal = null
      }

      mapped.push({
        name: clientName,
        email: emailVal,
        phone: phone || null,
        date_of_birth: dob,
        address: address || null,
        notes: notes || null,
        status: errors.some(e => e.includes('Name field')) ? 'invalid' : 'valid',
        errors
      })
    })

    return mapped
  }

  const updateEditedClient = (idx: number, field: keyof MappedClient, val: any) => {
    setEditedClients(prev => {
      if (!prev) return null
      const copy = [...prev]
      const item = { ...copy[idx] }

      if (field === 'name') {
        item.name = val
      } else if (field === 'email') {
        item.email = val || null
      } else if (field === 'phone') {
        item.phone = val || null
      } else if (field === 'date_of_birth') {
        item.date_of_birth = val || null
      } else if (field === 'address') {
        item.address = val || null
      } else if (field === 'notes') {
        item.notes = val || null
      }

      // Re-run validation
      const errors: string[] = []
      if (!item.name.trim()) {
        errors.push('Name field is missing or empty.')
      }
      if (item.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
        errors.push(`Invalid email format: "${item.email}". This field will be skipped.`)
      }

      // Re-check duplicate in memory
      const duplicate = existingClients.find(x => 
        (item.email && x.email && x.email.toLowerCase() === item.email.toLowerCase()) || 
        (item.phone && x.phone && x.phone === item.phone)
      )
      if (duplicate) {
        item.duplicateOf = duplicate
        errors.push(`Duplicate client detected: matches existing client "${duplicate.name}".`)
      } else {
        item.duplicateOf = undefined
      }

      item.errors = errors
      item.status = errors.some(e => e.includes('Name field')) ? 'invalid' : 'valid'
      copy[idx] = item
      return copy
    })
  }

  const mappedClients = editedClients || getMappedClients()
  const validClients = mappedClients.filter(c => c.status === 'valid')
  const invalidClientsCount = mappedClients.length - validClients.length

  // ── TRIGGER IMPORT EXECUTION ───────────────────────────────────────────────
  async function startImport() {
    setImporting(true)
    setStep(4)
    setImportProgress(0)
    setFailedRows([])

    const chunkSize = 25
    let successCount = 0
    let failedCount = 0
    const failedList: { row: any; error: string }[] = []

    const recordsToInsert = validClients.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone,
      date_of_birth: c.date_of_birth,
      address: c.address,
      notes: c.notes,
      duplicateOf: c.duplicateOf
    }))

    const totalRecords = recordsToInsert.length
    setImportStats({ total: totalRecords, success: 0, failed: 0 })

    for (let i = 0; i < totalRecords; i += chunkSize) {
      const chunk = recordsToInsert.slice(i, i + chunkSize)
      try {
        await Promise.all(chunk.map(async (c) => {
          try {
            if (c.duplicateOf) {
              if (conflictResolution === 'skip') {
                return
              }
              const id = c.duplicateOf.id
              if (conflictResolution === 'overwrite') {
                await updateClient(dataconnect, {
                  id,
                  name: c.name,
                  email: c.email,
                  phone: c.phone,
                  dateOfBirth: c.date_of_birth,
                  address: c.address,
                  notes: c.notes
                })
              } else if (conflictResolution === 'merge') {
                await updateClient(dataconnect, {
                  id,
                  name: c.duplicateOf.name || c.name,
                  email: c.duplicateOf.email || c.email,
                  phone: c.duplicateOf.phone || c.phone,
                  dateOfBirth: c.duplicateOf.dateOfBirth || c.date_of_birth,
                  address: c.duplicateOf.address || c.address,
                  notes: c.duplicateOf.notes || c.notes
                })
              }
            } else {
              await createClient(dataconnect, {
                orgId: orgId!,
                name: c.name,
                email: c.email,
                phone: c.phone,
                dateOfBirth: c.date_of_birth,
                address: c.address,
                notes: c.notes
              })
            }
            successCount++
          } catch (itemErr: any) {
            failedCount++
            failedList.push({ row: c, error: itemErr.message || 'Insert failed.' })
          }
        }))
      } catch (err) {
        failedCount += chunk.length
      }

      const progress = Math.min(100, Math.round(((i + chunk.length) / totalRecords) * 100))
      setImportProgress(progress)
      setImportStats({ total: totalRecords, success: successCount, failed: failedCount })
    }

    setFailedRows(failedList)

    logActivity({
      org_id: orgId,
      user_id: profile?.user_id,
      action: 'clients.bulk_imported',
      entity_type: 'client',
      metadata: { 
        total_attempted: mappedClients.length, 
        imported_successfully: successCount, 
        skipped_invalid: invalidClientsCount,
        failed_insert: failedCount,
        conflict_strategy: conflictResolution
      }
    })

    setImporting(false)
    if (failedCount === 0) {
      showToast(`Successfully imported ${successCount} clients`, 'success')
    } else {
      showToast(`Import completed with ${failedCount} failures. You can download the error report.`, 'warning')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Client Data Importer</h1>
          <p className="text-sm text-gray-500 mt-0.5">Import client databases from other systems via CSV file</p>
        </div>
        <button
          onClick={() => navigate('/clients')}
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          disabled={importing}
        >
          Cancel
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 bg-gray-950/40 p-3 rounded-xl border border-gray-800/60 justify-center">
        {[
          { num: 1, label: 'Upload CSV' },
          { num: 2, label: 'Map Columns' },
          { num: 3, label: 'Preview & Verify' },
          { num: 4, label: 'Import Roster' }
        ].map(s => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s.num
                ? 'bg-brand text-[#0c1a2e]'
                : step > s.num
                  ? 'bg-brand/20 text-brand'
                  : 'bg-gray-800 text-gray-500'
            }`}>
              {s.num}
            </div>
            <span className={`text-xs font-medium ${step === s.num ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
            {s.num < 4 && <div className="w-10 h-[1px] bg-gray-800 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-brand bg-brand/5'
              : 'border-gray-800 bg-gray-900/40 hover:bg-gray-900/60 hover:border-gray-700'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 text-brand flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Drag and drop your client CSV file here</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-4">
            Export your client list from Mindbody, Jane App, Boulevard, or Excel, and upload the file. We accept standard comma-separated files.
          </p>
          <button className="px-5 py-2.5 bg-brand text-[#0c1a2e] text-sm font-semibold rounded-lg hover:bg-brand transition-colors inline-block">
            Browse Files
          </button>
        </div>
      )}

      {/* Step 2: Mapping columns */}
      {step === 2 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Map CSV Columns</h2>
            <p className="text-xs text-gray-500">Align the columns from your uploaded file to the Bridgeway client database fields.</p>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {BRIDGEWAY_FIELDS.map(field => {
              const selectedHeader = mapping[field.key] || ''
              return (
                <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{field.desc}</p>
                  </div>
                  <div>
                    <select
                      value={selectedHeader}
                      onChange={e => handleMapChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
                    >
                      <option value="">-- Don't map this field --</option>
                      {csvHeaders.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
             <button
              onClick={async () => {
                // Validate that at least Name OR First Name/Last Name are mapped
                const hasName = mapping.name
                const hasSplitName = mapping.first_name || mapping.last_name
                if (!hasName && !hasSplitName) {
                  showToast('You must map either the Full Name field or at least one of First Name / Last Name', 'error')
                  return
                }
                
                try {
                  const { data } = await getOrgClients(dataconnect, { orgId: orgId! })
                  const existing = data?.clients || []
                  setExistingClients(existing)

                  // Build lookup maps
                  const existingByEmail = new Map(existing.filter(x => x.email).map(x => [x.email.toLowerCase(), x]))
                  const existingByPhone = new Map(existing.filter(x => x.phone).map(x => [x.phone, x]))

                  const initialMapped = getMappedClients().map(c => {
                    const duplicate = (c.email && existingByEmail.get(c.email.toLowerCase())) || (c.phone && existingByPhone.get(c.phone))
                    if (duplicate) {
                      return {
                        ...c,
                        duplicateOf: duplicate,
                        errors: [...c.errors, `Duplicate client detected: matches existing client "${duplicate.name}".`]
                      }
                    }
                    return c
                  })
                  setEditedClients(initialMapped)
                  setStep(3)
                } catch (err: any) {
                  showToast('Error checking existing clients directory.', 'error')
                  const initialMapped = getMappedClients()
                  setEditedClients(initialMapped)
                  setStep(3)
                }
              }}
              className="px-5 py-2.5 bg-brand text-[#0c1a2e] text-sm font-semibold rounded-lg hover:bg-brand transition-colors"
            >
              Preview Mapping
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview and verification */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Review & Verify Data</h2>
              <p className="text-xs text-gray-500 mt-1">Directly edit any cell inline. Select duplicate conflict resolution strategy below.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-950/40 border border-gray-800/60 p-2 rounded-lg text-xs">
                <span className="text-gray-400 font-medium">Duplicate Strategy:</span>
                <select
                  value={conflictResolution}
                  onChange={e => setConflictResolution(e.target.value as any)}
                  className="bg-[#0c1a2e] border border-gray-700 rounded text-white py-0.5 px-2 text-xs focus:ring-0 focus:outline-none"
                >
                  <option value="skip">Skip Duplicates</option>
                  <option value="overwrite">Overwrite / Update</option>
                  <option value="merge">Merge Empty Fields</option>
                </select>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                {validClients.length} ready to import
              </div>
              {invalidClientsCount > 0 && (
                <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                  {invalidClientsCount} skipped (no name)
                </div>
              )}
            </div>
          </div>
 
          {/* Table Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900 border-b border-gray-800 z-10">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Line</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Phone</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">DOB</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Validation status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {mappedClients.slice(0, 100).map((c, idx) => (
                    <tr key={idx} className={`text-xs hover:bg-white/[0.01] ${c.status === 'invalid' ? 'bg-red-500/[0.02]' : ''}`}>
                      <td className="px-5 py-3 text-gray-500 font-mono">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={c.name}
                          onChange={e => updateEditedClient(idx, 'name', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-gray-700 focus:border-brand px-1 py-0.5 w-full text-white text-xs focus:ring-0 focus:outline-none font-medium"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={c.email || ''}
                          onChange={e => updateEditedClient(idx, 'email', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-gray-700 focus:border-brand px-1 py-0.5 w-full text-gray-300 text-xs focus:ring-0 focus:outline-none"
                          placeholder="—"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={c.phone || ''}
                          onChange={e => updateEditedClient(idx, 'phone', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-gray-700 focus:border-brand px-1 py-0.5 w-full text-gray-300 text-xs focus:ring-0 focus:outline-none"
                          placeholder="—"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={c.date_of_birth || ''}
                          onChange={e => updateEditedClient(idx, 'date_of_birth', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-gray-700 focus:border-brand px-1 py-0.5 w-full text-gray-300 text-xs focus:ring-0 focus:outline-none"
                          placeholder="YYYY-MM-DD"
                        />
                      </td>
                      <td className="px-5 py-3">
                        {c.errors.length === 0 ? (
                          <span className="text-emerald-400 font-semibold">✓ Ready</span>
                        ) : (
                          <div className="space-y-1">
                            {c.errors.map((err, errIdx) => (
                              <span key={errIdx} className={`block text-[10px] ${err.includes('missing') ? 'text-red-400 font-semibold' : 'text-amber-400'}`}>
                                ⚠ {err}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {mappedClients.length > 100 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-3 text-center text-gray-500 font-medium">
                        Showing first 100 of {mappedClients.length} rows...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
 
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={startImport}
              disabled={validClients.length === 0}
              className="px-6 py-2.5 bg-brand text-[#0c1a2e] text-sm font-semibold rounded-lg hover:bg-brand disabled:opacity-50 transition-colors"
            >
              Import {validClients.length} Clients
            </button>
          </div>
        </div>
      )}
 
      {/* Step 4: Import execution and success */}
      {step === 4 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-6 max-w-md mx-auto">
          {importing ? (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-brand/20 border-t-brand animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Importing Clients...</h3>
                <p className="text-xs text-gray-500">Writing roster chunks to the database. Do not close this tab.</p>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-brand h-full rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Progress</span>
                  <span className="tabular-nums font-bold text-white">{importProgress}%</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-300 tabular-nums">
                {importStats.success} / {importStats.total} imported
              </div>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                failedRows.length === 0 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              }`}>
                {failedRows.length === 0 ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {failedRows.length === 0 ? 'Import Completed' : 'Import Partially Completed'}
                </h3>
                <p className="text-xs text-gray-500">
                  {failedRows.length === 0 
                    ? 'Your client database has been successfully updated.' 
                    : 'The database was updated, but some rows had conflicts or insert errors.'}
                </p>
              </div>
              <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/60 text-sm space-y-2 max-w-xs mx-auto">
                <div className="flex justify-between"><span className="text-gray-500">Total Clients:</span><span className="text-white font-bold">{mappedClients.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Imported:</span><span className="text-emerald-400 font-bold">{importStats.success}</span></div>
                {invalidClientsCount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Skipped (Invalid):</span><span className="text-amber-400 font-bold">{invalidClientsCount}</span></div>
                )}
                {failedRows.length > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Failed / Rejected:</span><span className="text-red-400 font-bold">{failedRows.length}</span></div>
                )}
              </div>
              
              {failedRows.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const headers = ['Name', 'Email', 'Phone', 'DOB', 'Address', 'Notes', 'Error Reason']
                      const csvRowsStr = failedRows.map(f => [
                        `"${f.row.name.replace(/"/g, '""')}"`,
                        `"${(f.row.email || '').replace(/"/g, '""')}"`,
                        `"${(f.row.phone || '').replace(/"/g, '""')}"`,
                        `"${(f.row.date_of_birth || '').replace(/"/g, '""')}"`,
                        `"${(f.row.address || '').replace(/"/g, '""')}"`,
                        `"${(f.row.notes || '').replace(/"/g, '""')}"`,
                        `"${f.error.replace(/"/g, '""')}"`
                      ].join(','))
                      const csvContent = [headers.join(','), ...csvRowsStr].join('\n')
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.setAttribute('href', url)
                      link.setAttribute('download', `failed_clients_import_${Date.now()}.csv`)
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className="w-full px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Download Failed Rows (CSV)
                  </button>
                </div>
              )}
 
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    setFileName('')
                    setCsvHeaders([])
                    setCsvRows([])
                    setMapping({})
                    setEditedClients(null)
                    setFailedRows([])
                    setStep(1)
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Import Another File
                </button>
                <button
                  onClick={() => navigate('/clients')}
                  className="px-5 py-2 bg-brand text-[#0c1a2e] text-xs font-semibold rounded-lg hover:bg-brand transition-colors"
                >
                  Go to Client Directory
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
