/**
 * Staff Scheduling — demand forecast + staff matching.
 * (Tier 1, Smart Resource Allocation)
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Skeleton, Alert, Button, SimpleBarChart } from '../../../shared/components/ui';

interface DailyForecast {
  date: string;
  dayOfWeek: number;
  expectedTotal: number;
  hourly: { hour: number; expectedAppointments: number }[];
}

interface ForecastResponse {
  dailyForecasts: DailyForecast[];
  weeklyTrends: { last28Days: number; prior28Days: number; growthRate: number };
  confidenceScore: number;
  sampleSize: number;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StaffScheduling() {
  const { orgId } = useAuth();
  const { call: forecast, loading, error } = useCallable<
    { orgId: string; rangeStart: string; rangeEnd: string },
    ForecastResponse
  >('forecastDemand');
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);

  const loadForecast = async () => {
    if (!orgId) return;
    const rangeStart = new Date().toISOString();
    const rangeEnd = new Date(Date.now() + 14 * 86400000).toISOString();
    const result = await forecast({ orgId, rangeStart, rangeEnd });
    if (result) {
      setData(result);
      setSelectedDay(result.dailyForecasts[0] ?? null);
    }
  };

  useEffect(() => {
    loadForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff Scheduling</h1>
          <p className="text-sm text-gray-500">14-day demand forecast from the last 90 days of bookings.</p>
        </div>
        <Button variant="secondary" onClick={loadForecast} loading={loading}>
          Refresh
        </Button>
      </div>

      {error && <Alert kind="error" title="Forecast failed">{error.message}</Alert>}
      {loading && !data && <Skeleton rows={4} />}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Bookings (last 28d)"
              value={data.weeklyTrends.last28Days}
              trend={data.weeklyTrends.growthRate * 100}
              sub="vs prior 28 days"
            />
            <StatCard label="Forecast Confidence" value={`${Math.round(data.confidenceScore * 100)}%`} sub={`${data.sampleSize} appointments analyzed`} />
            <StatCard
              label="Busiest Day Ahead"
              value={(() => {
                const top = [...data.dailyForecasts].sort((a, b) => b.expectedTotal - a.expectedTotal)[0];
                return top ? `${DAY_NAMES[top.dayOfWeek]} ${top.date.slice(5)}` : '—';
              })()}
            />
            <StatCard
              label="Expected (next 14d)"
              value={Math.round(data.dailyForecasts.reduce((s, d) => s + d.expectedTotal, 0))}
              sub="appointments"
            />
          </div>

          <Card title="Daily Demand — Next 14 Days">
            <SimpleBarChart
              data={data.dailyForecasts.map((d) => ({
                label: `${DAY_NAMES[d.dayOfWeek]} ${d.date.slice(8)}`,
                value: d.expectedTotal,
              }))}
            />
            <div className="flex flex-wrap gap-1 mt-3">
              {data.dailyForecasts.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDay(d)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedDay?.date === d.date ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d.date.slice(5)}
                </button>
              ))}
            </div>
          </Card>

          {selectedDay && (
            <Card title={`Hourly Breakdown — ${DAY_NAMES[selectedDay.dayOfWeek]} ${selectedDay.date}`}>
              {selectedDay.hourly.length === 0 ? (
                <p className="text-sm text-gray-500">No expected demand this day.</p>
              ) : (
                <SimpleBarChart
                  data={selectedDay.hourly.map((h) => ({
                    label: `${h.hour}:00`,
                    value: h.expectedAppointments,
                  }))}
                  formatValue={(v) => v.toFixed(1)}
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                Staff the peak hours first — use the staff matcher on individual appointments for client-preference-aware
                assignment.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
