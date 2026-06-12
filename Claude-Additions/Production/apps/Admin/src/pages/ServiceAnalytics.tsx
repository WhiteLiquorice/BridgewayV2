/**
 * Service Analytics — performance per service from the nightly rollup.
 * (Tier 1, Service Analytics)
 */
import React, { useMemo } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, StatCard, Badge, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';

interface ServiceMetric {
  id: string;
  serviceId: string;
  serviceName: string;
  month: string;
  bookings: number;
  completed: number;
  revenue: number;
  noShowRate: number;
  cancellationRate: number;
  averageRating: number | null;
  previousMonthBookings: number | null;
  previousMonthRevenue: number | null;
}

const currency = (n: number) => `$${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const pct = (n: number | null) => (n == null ? '—' : `${(n * 100).toFixed(1)}%`);

export default function ServiceAnalytics() {
  const { orgId } = useAuth();
  const thisMonth = new Date().toISOString().slice(0, 7);

  const { data: metrics, loading, error } = useFirestoreQuery<ServiceMetric>(db, 'serviceMetrics', {
    where: [
      ['orgId', '==', orgId],
      ['month', '==', thisMonth],
    ],
    enabled: !!orgId,
  });

  const sorted = useMemo(() => [...metrics].sort((a, b) => b.revenue - a.revenue), [metrics]);

  const totals = useMemo(
    () =>
      metrics.reduce(
        (acc, m) => ({
          revenue: acc.revenue + m.revenue,
          bookings: acc.bookings + m.bookings,
          prevRevenue: acc.prevRevenue + (m.previousMonthRevenue || 0),
        }),
        { revenue: 0, bookings: 0, prevRevenue: 0 }
      ),
    [metrics]
  );

  const revenueTrend =
    totals.prevRevenue > 0 ? ((totals.revenue - totals.prevRevenue) / totals.prevRevenue) * 100 : undefined;

  if (error) return <Alert kind="error" title="Couldn't load service metrics">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Service Analytics</h1>
        <p className="text-sm text-gray-500">Performance this month ({thisMonth}), refreshed nightly.</p>
      </div>

      {loading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Revenue (MTD)" value={currency(totals.revenue)} trend={revenueTrend} sub="vs last month" />
            <StatCard label="Bookings (MTD)" value={totals.bookings} />
            <StatCard label="Active Services" value={metrics.length} />
          </div>

          <Card title="Service Performance">
            {sorted.length === 0 ? (
              <EmptyState message="No metrics for this month yet — the nightly rollup will populate this." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Service</th>
                    <th className="py-2 pr-4 text-right">Bookings</th>
                    <th className="py-2 pr-4 text-right">Revenue</th>
                    <th className="py-2 pr-4 text-right">MoM</th>
                    <th className="py-2 pr-4 text-right">No-Show</th>
                    <th className="py-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m) => {
                    const mom =
                      m.previousMonthBookings && m.previousMonthBookings > 0
                        ? ((m.bookings - m.previousMonthBookings) / m.previousMonthBookings) * 100
                        : null;
                    return (
                      <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium text-gray-900">{m.serviceName || m.serviceId}</td>
                        <td className="py-2 pr-4 text-right">{m.bookings}</td>
                        <td className="py-2 pr-4 text-right">{currency(m.revenue)}</td>
                        <td className="py-2 pr-4 text-right">
                          {mom == null ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <span className={mom >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {mom >= 0 ? '+' : ''}
                              {mom.toFixed(0)}%
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <Badge color={m.noShowRate > 0.15 ? 'red' : m.noShowRate > 0.08 ? 'yellow' : 'green'}>
                            {pct(m.noShowRate)}
                          </Badge>
                        </td>
                        <td className="py-2 text-right">{m.averageRating != null ? `${m.averageRating.toFixed(1)} ★` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
