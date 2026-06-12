/**
 * Recurring Revenue — MRR trend and subscriber health.
 * (Tier 2, Recurring Revenue Dashboard)
 */
import React, { useMemo } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, StatCard, Badge, Skeleton, Alert, EmptyState, SimpleLineChart } from '../../../shared/components/ui';

interface MrrSnapshot {
  id: string;
  month: string;
  totalMRR: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  canceledSubscriptions: number;
  averageARPU: number;
}

interface RecurringClient {
  id: string;
  displayName?: string;
  name?: string;
  recurringRevenuePerMonth?: number;
  churnRiskFlag?: boolean;
}

const currency = (n: number) => `$${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function RecurringRevenue() {
  const { orgId } = useAuth();

  const { data: history, loading: historyLoading, error } = useFirestoreQuery<MrrSnapshot>(db, 'mrrHistory', {
    where: [['orgId', '==', orgId]],
    orderBy: [['month', 'asc']],
    limit: 24,
    enabled: !!orgId,
  });

  const { data: subscribers, loading: subsLoading } = useFirestoreQuery<RecurringClient>(db, 'clients', {
    where: [
      ['orgId', '==', orgId],
      ['isRecurring', '==', true],
    ],
    enabled: !!orgId,
  });

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const mrrTrend =
    latest && previous && previous.totalMRR > 0
      ? ((latest.totalMRR - previous.totalMRR) / previous.totalMRR) * 100
      : undefined;

  const liveMrr = useMemo(
    () => subscribers.reduce((s, c) => s + (c.recurringRevenuePerMonth || 0), 0),
    [subscribers]
  );
  const atRiskSubs = subscribers.filter((c) => c.churnRiskFlag);

  if (error) return <Alert kind="error" title="Couldn't load MRR data">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Recurring Revenue</h1>
        <p className="text-sm text-gray-500">Subscription clients and monthly recurring revenue.</p>
      </div>

      {historyLoading || subsLoading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Current MRR" value={currency(liveMrr)} trend={mrrTrend} sub="vs last snapshot" />
            <StatCard label="Active Subscribers" value={subscribers.length} />
            <StatCard label="ARPU" value={subscribers.length ? currency(liveMrr / subscribers.length) : '—'} />
            <StatCard label="At-Risk Subscribers" value={atRiskSubs.length} sub="high churn score" />
          </div>

          <Card title="MRR Trend">
            {history.length < 2 ? (
              <EmptyState message="MRR history builds monthly — check back after the next snapshot." />
            ) : (
              <SimpleLineChart data={history.map((h) => ({ label: h.month, value: h.totalMRR }))} />
            )}
          </Card>

          {atRiskSubs.length > 0 && (
            <Card title="At-Risk Subscribers">
              <ul className="divide-y divide-gray-50">
                {atRiskSubs.slice(0, 20).map((c) => (
                  <li key={c.id} className="py-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{c.displayName || c.name || c.id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{currency(c.recurringRevenuePerMonth || 0)}/mo</span>
                      <Badge color="red">at risk</Badge>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                These subscribers show high churn risk — consider a personal check-in before their next billing date.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
