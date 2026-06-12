/**
 * Custom Reports — date range + metric picker, CSV export.
 * (Tier 2, Custom Reports)
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, Button, Alert, EmptyState } from '../../../shared/components/ui';
import { trackEvent } from '../../../shared/lib/analytics';

const METRICS = [
  { key: 'appointments', label: 'Appointments' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'newClients', label: 'New Clients' },
  { key: 'serviceBreakdown', label: 'Service Breakdown' },
  { key: 'staffBreakdown', label: 'Staff Breakdown' },
];

interface ReportResponse {
  rangeStart: string;
  rangeEnd: string;
  sections: Record<string, unknown>;
}

export default function Reports() {
  const { orgId } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [rangeStart, setRangeStart] = useState(monthAgo);
  const [rangeEnd, setRangeEnd] = useState(today);
  const [selected, setSelected] = useState<string[]>(['appointments', 'revenue']);
  const [report, setReport] = useState<ReportResponse | null>(null);

  const { call: generate, loading, error } = useCallable<object, ReportResponse>('generateCustomReport');
  const { call: generateCsv, loading: csvLoading } = useCallable<object, { csv: string }>('generateCustomReport');

  const runReport = async () => {
    const result = await generate({ orgId, metrics: selected, rangeStart, rangeEnd });
    if (result) {
      setReport(result);
      trackEvent('report_generated', { metrics: selected.join(','), days: selected.length });
    }
  };

  const downloadCsv = async () => {
    const result = await generateCsv({ orgId, metrics: selected, rangeStart, rangeEnd, format: 'csv' });
    if (result?.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${rangeStart}_${rangeEnd}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Custom Reports</h1>
        <p className="text-sm text-gray-500">Any date range, any metrics, exportable as CSV.</p>
      </div>

      <Card title="Report Builder">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={rangeStart} max={rangeEnd} onChange={(e) => setRangeStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={rangeEnd} min={rangeStart} max={today} onChange={(e) => setRangeEnd(e.target.value)} />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {METRICS.map((m) => (
            <label key={m.key} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(m.key)}
                onChange={(e) =>
                  setSelected((prev) => (e.target.checked ? [...prev, m.key] : prev.filter((k) => k !== m.key)))
                }
              />
              {m.label}
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={runReport} loading={loading} disabled={selected.length === 0}>
            Generate
          </Button>
          <Button variant="secondary" onClick={downloadCsv} loading={csvLoading} disabled={selected.length === 0}>
            Download CSV
          </Button>
        </div>
      </Card>

      {error && <Alert kind="error" title="Report failed">{error.message}</Alert>}

      {report && (
        <Card title={`Report: ${rangeStart} → ${rangeEnd}`}>
          {Object.keys(report.sections).length === 0 ? (
            <EmptyState message="No data in this range." />
          ) : (
            <div className="space-y-6">
              {Object.entries(report.sections).map(([name, section]) => (
                <div key={name}>
                  <h4 className="text-sm font-semibold text-gray-900 capitalize mb-2">
                    {name.replace(/([A-Z])/g, ' $1')}
                  </h4>
                  {Array.isArray(section) ? (
                    section.length === 0 ? (
                      <p className="text-sm text-gray-500">No rows.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                            {Object.keys(section[0] as object).map((h) => (
                              <th key={h} className="py-1.5 pr-4 capitalize">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(section as Record<string, unknown>[]).map((row, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="py-1.5 pr-4">{typeof v === 'number' ? v.toLocaleString() : String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(section as Record<string, unknown>).map(([k, v]) => (
                        <div key={k} className="bg-gray-50 rounded p-2">
                          <dt className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</dt>
                          <dd className="text-sm font-semibold text-gray-900">
                            {typeof v === 'number' ? v.toLocaleString() : String(v)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
