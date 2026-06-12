/**
 * CLV Dashboard — tier distribution, at-risk clients, top clients.
 * (Tier 1, CLV Dashboard)
 *
 * Reads the nightly clientMetrics rollup; no on-demand computation.
 */
import React, { useMemo, useState } from 'react';
import { db } from '../../lib/firebase'; // adjust to your app's firebase export
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { Card, StatCard, Badge, Skeleton, Alert, EmptyState, SimpleBarChart } from '../../../shared/components/ui';

interface ClientMetric {
  id: string;
  clientId: string;
  clientName: string;
  lifeTimeValue: number;
  totalSpent: number;
  projectedValue: number;
  appointmentCount: number;
  averageTicketValue: number;
  daysSinceLastVisit: number | null;
  churnRiskScore: number;
  churnRecommendation: string;
  tier: 'gold' | 'silver' | 'bronze';
  preferredServices: string[];
}

const currency = (n: number) => `$${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function ClientValue() {
  const { orgId } = useAuth();
  const [view, setView] = useState<'top' | 'at-risk'>('top');

  const { data: metrics, loading, error } = useFirestoreQuery<ClientMetric>(db, 'clientMetrics', {
    where: [['orgId', '==', orgId]],
    orderBy: [['lifeTimeValue', 'desc']],
    limit: 500,
    enabled: !!orgId,
  });

  const summary = useMemo(() => {
    const tiers = { gold: 0, silver: 0, bronze: 0 };
    let totalLtv = 0;
    let atRisk = 0;
    metrics.forEach((m) => {
      tiers[m.tier] = (tiers[m.tier] || 0) + 1;
      totalLtv += m.lifeTimeValue || 0;
      if (m.churnRiskScore >= 70) atRisk += 1;
    });
    return { tiers, totalLtv, atRisk, avgLtv: metrics.length ? totalLtv / metrics.length : 0 };
  }, [metrics]);

  const atRiskClients = useMemo(
    () => [...metrics].filter((m) => m.churnRiskScore >= 40).sort((a, b) => b.churnRiskScore - a.churnRiskScore),
    [metrics]
  );

  if (error) return <Alert kind="error" title="Couldn't load client metrics">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Client Lifetime Value</h1>
        <p className="text-sm text-gray-500">Updated nightly from appointment and payment history.</p>
      </div>

      {loading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Client Value" value={currency(summary.totalLtv)} sub={`${metrics.length} clients`} />
            <StatCard label="Average CLV" value={currency(summary.avgLtv)} />
            <StatCard label="Gold Tier" value={summary.tiers.gold} sub="CLV ≥ $1,000" />
            <StatCard label="At Risk" value={summary.atRisk} sub="churn score ≥ 70" />
          </div>

          <Card title="Tier Distribution">
            <SimpleBarChart
              data={[
                { label: 'Gold', value: summary.tiers.gold },
                { label: 'Silver', value: summary.tiers.silver },
                { label: 'Bronze', value: summary.tiers.bronze },
              ]}
            />
          </Card>

          <Card
            title={view === 'top' ? 'Top Clients by CLV' : 'At-Risk Clients'}
            actions={
              <div className="flex gap-1 text-xs">
                <button
                  className={`px-2 py-1 rounded ${view === 'top' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
                  onClick={() => setView('top')}
                >
                  Top Clients
                </button>
                <button
                  className={`px-2 py-1 rounded ${view === 'at-risk' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
                  onClick={() => setView('at-risk')}
                >
                  At Risk ({atRiskClients.length})
                </button>
              </div>
            }
          >
            {(view === 'top' ? metrics.slice(0, 25) : atRiskClients.slice(0, 25)).length === 0 ? (
              <EmptyState message="No client metrics yet — the nightly job will populate this." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Client</th>
                    <th className="py-2 pr-4">Tier</th>
                    <th className="py-2 pr-4 text-right">CLV</th>
                    <th className="py-2 pr-4 text-right">Visits</th>
                    <th className="py-2 pr-4 text-right">Last Visit</th>
                    <th className="py-2 text-right">Churn Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(view === 'top' ? metrics.slice(0, 25) : atRiskClients.slice(0, 25)).map((m) => (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-gray-900">{m.clientName || m.clientId}</td>
                      <td className="py-2 pr-4">
                        <Badge color={m.tier === 'gold' ? 'amber' : m.tier === 'silver' ? 'gray' : 'indigo'}>
                          {m.tier}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4 text-right">{currency(m.lifeTimeValue)}</td>
                      <td className="py-2 pr-4 text-right">{m.appointmentCount}</td>
                      <td className="py-2 pr-4 text-right text-gray-500">
                        {m.daysSinceLastVisit != null ? `${m.daysSinceLastVisit}d ago` : '—'}
                      </td>
                      <td className="py-2 text-right">
                        <Badge color={m.churnRiskScore >= 70 ? 'red' : m.churnRiskScore >= 40 ? 'yellow' : 'green'}>
                          {m.churnRiskScore}
                        </Badge>
                      </td>
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
