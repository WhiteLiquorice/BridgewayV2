/**
 * Feedback Analytics — ratings summary and recent comments.
 * (Tier 3, Feedback System)
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';

interface FeedbackSummary {
  count: number;
  averageOverall: number | null;
  averageService: number | null;
  averageStaff: number | null;
  npsPercent: number | null;
  recent: { overallRating: number; comment: string; createdAt: unknown }[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.round(rating))}
      <span className="text-gray-300">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export default function FeedbackAnalytics() {
  const { orgId } = useAuth();
  const { call: getSummary, loading, error } = useCallable<object, FeedbackSummary>('getFeedbackSummary');
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);

  useEffect(() => {
    if (!orgId) return;
    getSummary({ orgId }).then((result) => result && setSummary(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Client Feedback</h1>
        <p className="text-sm text-gray-500">From post-appointment surveys (last 500 responses).</p>
      </div>

      {error && <Alert kind="error" title="Couldn't load feedback">{error.message}</Alert>}
      {loading && !summary && <Skeleton rows={4} />}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Overall Rating"
              value={summary.averageOverall != null ? `${summary.averageOverall.toFixed(1)} ★` : '—'}
              sub={`${summary.count} responses`}
            />
            <StatCard label="Service Quality" value={summary.averageService != null ? `${summary.averageService.toFixed(1)} ★` : '—'} />
            <StatCard label="Staff Rating" value={summary.averageStaff != null ? `${summary.averageStaff.toFixed(1)} ★` : '—'} />
            <StatCard label="Would Recommend" value={summary.npsPercent != null ? `${summary.npsPercent}%` : '—'} />
          </div>

          <Card title="Recent Comments">
            {summary.recent.filter((r) => r.comment).length === 0 ? (
              <EmptyState message="No written feedback yet." />
            ) : (
              <ul className="divide-y divide-gray-50">
                {summary.recent
                  .filter((r) => r.comment)
                  .map((r, i) => (
                    <li key={i} className="py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Stars rating={r.overallRating} />
                      </div>
                      <p className="text-sm text-gray-700">{r.comment}</p>
                    </li>
                  ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
