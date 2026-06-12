/**
 * Client Segments — predefined segment browser with bulk actions.
 * (Tier 2, Client Segmentation)
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { useBulkSelection } from '../../../shared/hooks/useBulkSelection';
import { Card, Badge, Button, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';
import BulkActionBar from '../components/BulkActionBar';

interface SegmentMember {
  id: string;
  clientId: string;
  clientName: string;
  lifeTimeValue: number;
  churnRiskScore: number;
  daysSinceLastVisit: number | null;
}

const SEGMENTS = [
  { key: 'high_value', label: 'High Value', description: 'CLV ≥ $1,000', color: 'amber' as const },
  { key: 'at_risk', label: 'At Risk', description: 'Churn score ≥ 70', color: 'red' as const },
  { key: 'inactive_60', label: 'Inactive 60+ Days', description: 'No visit in 60 days', color: 'yellow' as const },
  { key: 'frequent', label: 'Frequent Visitors', description: '1.5+ visits/month', color: 'green' as const },
  { key: 'new_clients', label: 'New Clients', description: 'First visit < 30 days ago', color: 'indigo' as const },
];

export default function ClientSegments() {
  const { orgId } = useAuth();
  const [activeSegment, setActiveSegment] = useState<string>('high_value');
  const [members, setMembers] = useState<SegmentMember[]>([]);
  const { call: getMembers, loading, error } = useCallable<
    { orgId: string; segmentKey: string },
    { members: Omit<SegmentMember, 'id'>[]; count: number }
  >('getSegmentMembers');

  const selection = useBulkSelection(members);

  const loadSegment = async (key: string) => {
    setActiveSegment(key);
    selection.clear();
    if (!orgId) return;
    const result = await getMembers({ orgId, segmentKey: key });
    if (result) {
      setMembers(result.members.map((m) => ({ ...m, id: m.clientId })));
    }
  };

  React.useEffect(() => {
    loadSegment('high_value');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Client Segments</h1>
        <p className="text-sm text-gray-500">Built from nightly client metrics. Select clients for bulk actions.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SEGMENTS.map((s) => (
          <button
            key={s.key}
            onClick={() => loadSegment(s.key)}
            className={`px-3 py-2 rounded-lg border text-left ${
              activeSegment === s.key ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-medium text-gray-900 block">{s.label}</span>
            <span className="text-xs text-gray-500">{s.description}</span>
          </button>
        ))}
      </div>

      {error && <Alert kind="error" title="Couldn't load segment">{error.message}</Alert>}

      <Card title={`${SEGMENTS.find((s) => s.key === activeSegment)?.label} — ${members.length} clients`}>
        {loading ? (
          <Skeleton rows={4} />
        ) : members.length === 0 ? (
          <EmptyState message="No clients in this segment." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-2 w-8">
                  <input type="checkbox" checked={selection.allSelected} onChange={selection.toggleAll} aria-label="Select all" />
                </th>
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4 text-right">CLV</th>
                <th className="py-2 pr-4 text-right">Churn Risk</th>
                <th className="py-2 text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 pr-2">
                    <input
                      type="checkbox"
                      checked={selection.isSelected(m.id)}
                      onChange={() => selection.toggle(m.id)}
                      aria-label={`Select ${m.clientName}`}
                    />
                  </td>
                  <td className="py-2 pr-4 font-medium text-gray-900">{m.clientName || m.clientId}</td>
                  <td className="py-2 pr-4 text-right">${(m.lifeTimeValue ?? 0).toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right">
                    <Badge color={m.churnRiskScore >= 70 ? 'red' : m.churnRiskScore >= 40 ? 'yellow' : 'green'}>
                      {m.churnRiskScore}
                    </Badge>
                  </td>
                  <td className="py-2 text-right text-gray-500">
                    {m.daysSinceLastVisit != null ? `${m.daysSinceLastVisit}d ago` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <BulkActionBar
        selectedCount={selection.selectedCount}
        selectedIds={[...selection.selectedIds]}
        collection="clients"
        onDone={selection.clear}
      />
    </div>
  );
}
