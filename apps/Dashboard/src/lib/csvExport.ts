/**
 * Convert an array of objects to CSV and trigger a download.
 *
 * @param {object[]} rows  – data array
 * @param {string[]} columns – keys to include (in order)
 * @param {Record<string,string>} [headers] – optional display headers, e.g. { scheduled_at: 'Date' }
 * @param {string} [filename] – download filename, default 'export.csv'
 */
export function downloadCSV(rows, columns, headers = {}, filename = 'export.csv') {
  if (!rows || rows.length === 0) return

  const headerRow = columns.map(c => quote(headers[c] || c))
  const dataRows = rows.map(row =>
    columns.map(c => {
      let val = row[c]
      // Flatten nested objects (e.g. clients.name)
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        val = val.name || val.full_name || val.email || JSON.stringify(val)
      }
      return quote(val ?? '')
    })
  )

  const csv = [headerRow, ...dataRows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function quote(val) {
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}
