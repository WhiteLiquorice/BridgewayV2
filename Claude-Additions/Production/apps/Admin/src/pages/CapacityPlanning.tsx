/**
 * Capacity Planning — growth projections and hiring recommendations.
 * (Tier 3, Capacity Planning)
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Badge, Skeleton, Alert, SimpleLineChart } from '../../../shared/components/ui';

interface CapacityResponse {
  error?: string;
  monthsOfHistory?: number;
  history: { month: string; appointments: number; hours: number }[];
  monthlyGrowth: number;
  projections: {
    month: string;
    projectedAppointments: number;
    projectedHours: number;
    staffNeeded: number;
    currentStaff: number;
    shortfall: number;
    utilizationAtCurrentStaff: number | null;
  }[];
  recommendation: string;
}

export default function CapacityPlanning() {
  const { orgId } = useAuth();
  const { call: forecast, loading, error } = useCallable<object, CapacityResponse>('forecastCapacity');
  const [data, setData] = useState<CapacityResponse | null>(null);

  useEffect(() => {
    if (!orgId) return;
    forecast({ orgId, monthsAhead: 6 }).then((result) => result && setData(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Capacity Planning</h1>
        <p className="text-sm text-gray-500">6-month demand projection vs. current staffing.</p>
      </div>

      {error && <Alert kind="error" title="Forecast failed">{error.message}</Alert>}
      {loading && !data && <Skeleton rows={4} />}
      {data?.error && <Alert kind="warning" title="Not enough history">{data.error}</Alert>}

      {data && !data.error && (
        <>
          <Alert kind={data.projections.some((p) => p.shortfall > 0) ? 'warning' : 'success'} title="Recommendation">
            {data.recommendation}
          </Alert>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Monthly Growth"
              value={`${data.monthlyGrowth >= 0 ? '+' : ''}${data.monthlyGrowth}`}
              sub="appointments/month trend"
            />
            <StatCard label="Current Staff" value={data.projections[0]?.currentStaff ?? '—'} />
            <StatCard
              label="Peak Utilization"
              value={`${Math.max(...data.projections.map((p) => p.utilizationAtCurrentStaff || 0))}%`}
              sub="at current staffing"
            />
          </div>

          <Card title="Appointment Volume — History & Projection">
            <SimpleLineChart
              data={[
                ...data.history.map((h) => ({ label: h.month, value: h.appointments })),
                ...data.projections.map((p) => ({ label: `${p.month}*`, value: p.projectedAppointments })),
              ]}
            />
            <p className="text-xs text-gray-500 mt-1">* projected</p>
          </Card>

          <Card title="Staffing Projection">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4 text-right">Projected Appointments</th>
                  <th className="py-2 pr-4 text-right">Hours Needed</th>
                  <th className="py-2 pr-4 text-right">Staff Needed</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.projections.map((p) => (
                  <tr key={p.month} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-medium">{p.month}</td>
                    <td className="py-2 pr-4 text-right">{p.projectedAppointments}</td>
                    <td className="py-2 pr-4 text-right">{p.projectedHours}</td>
                    <td className="py-2 pr-4 text-right">{p.staffNeeded}</td>
                    <td className="py-2 text-right">
                      {p.shortfall > 0 ? (
                        <Badge color="red">need +{p.shortfall}</Badge>
                      ) : (p.utilizationAtCurrentStaff || 0) > 85 ? (
                        <Badge color="yellow">tight</Badge>
                      ) : (
                        <Badge color="green">covered</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
