/**
 * Staff Performance — leaderboard from the nightly staffMetrics rollup.
 * (Tier 1, Staff Performance)
 */
import React, { useMemo, useState } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, StatCard, Badge, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';

interface StaffMetric {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  appointmentsCompleted: number;
  onTimeRate: number | null;
  averageRating: number | null;
  hoursBooked: number;
  utilizationRate: number | null;
  revenueGenerated: number;
  clientsServed: number;
}

type SortKey = 'revenueGenerated' | 'appointmentsCompleted' | 'averageRating' | 'utilizationRate';

const currency = (n: number) => `$${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function StaffPerformance() {
  const { orgId } = useAuth();
  const [sortKey, setSortKey] = useState<SortKey>('revenueGenerated');
  const thisMonth = new Date().toISOString().slice(0, 7);

  const { data: metrics, loading, error } = useFirestoreQuery<StaffMetric>(db, 'staffMetrics', {
    where: [
      ['orgId', '==', orgId],
      ['month', '==', thisMonth],
    ],
    enabled: !!orgId,
  });

  const sorted = useMemo(
    () => [...metrics].sort((a, b) => ((b[sortKey] as number) || 0) - ((a[sortKey] as number) || 0)),
    [metrics, sortKey]
  );

  const totals = useMemo(
    () => ({
      revenue: metrics.reduce((s, m) => s + m.revenueGenerated, 0),
      appointments: metrics.reduce((s, m) => s + m.appointmentsCompleted, 0),
      avgUtilization:
        metrics.filter((m) => m.utilizationRate != null).length > 0
          ? metrics.reduce((s, m) => s + (m.utilizationRate || 0), 0) /
            metrics.filter((m) => m.utilizationRate != null).length
          : null,
    }),
    [metrics]
  );

  if (error) return <Alert kind="error" title="Couldn't load staff metrics">{error.message}</Alert>;

  const sortButtons: { key: SortKey; label: string }[] = [
    { key: 'revenueGenerated', label: 'Revenue' },
    { key: 'appointmentsCompleted', label: 'Appointments' },
    { key: 'averageRating', label: 'Rating' },
    { key: 'utilizationRate', label: 'Utilization' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Staff Performance</h1>
        <p className="text-sm text-gray-500">This month ({thisMonth}), refreshed nightly.</p>
      </div>

      {loading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Team Revenue (MTD)" value={currency(totals.revenue)} />
            <StatCard label="Appointments Completed" value={totals.appointments} />
            <StatCard
              label="Avg Utilization"
              value={totals.avgUtilization != null ? `${Math.round(totals.avgUtilization * 100)}%` : '—'}
              sub="booked vs available hours"
            />
          </div>

          <Card
            title="Leaderboard"
            actions={
              <div className="flex gap-1 text-xs">
                {sortButtons.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setSortKey(b.key)}
                    className={`px-2 py-1 rounded ${sortKey === b.key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            }
          >
            {sorted.length === 0 ? (
              <EmptyState message="No staff metrics yet — the nightly rollup will populate this." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Staff</th>
                    <th className="py-2 pr-4 text-right">Appointments</th>
                    <th className="py-2 pr-4 text-right">Clients</th>
                    <th className="py-2 pr-4 text-right">Revenue</th>
                    <th className="py-2 pr-4 text-right">On-Time</th>
                    <th className="py-2 pr-4 text-right">Utilization</th>
                    <th className="py-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m, i) => (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-400">{i + 1}</td>
                      <td className="py-2 pr-4 font-medium text-gray-900">{m.staffName || m.staffId}</td>
                      <td className="py-2 pr-4 text-right">{m.appointmentsCompleted}</td>
                      <td className="py-2 pr-4 text-right">{m.clientsServed}</td>
                      <td className="py-2 pr-4 text-right">{currency(m.revenueGenerated)}</td>
                      <td className="py-2 pr-4 text-right">{m.onTimeRate != null ? `${Math.round(m.onTimeRate * 100)}%` : '—'}</td>
                      <td className="py-2 pr-4 text-right">
                        {m.utilizationRate != null ? (
                          <Badge color={m.utilizationRate > 0.85 ? 'red' : m.utilizationRate > 0.6 ? 'green' : 'yellow'}>
                            {Math.round(m.utilizationRate * 100)}%
                          </Badge>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 text-right">{m.averageRating != null ? `${m.averageRating.toFixed(1)} ★` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
