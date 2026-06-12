/**
 * Staff Queue Dashboard — live queue with assignment and completion.
 * (Tier 1, Queue Management)
 */
import React, { useMemo } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Badge, Button, Skeleton, Alert, EmptyState } from '../../../shared/components/ui';

interface QueueEntry {
  id: string;
  clientName: string;
  serviceName: string;
  status: 'waiting' | 'in-service';
  checkInTime: { toDate(): Date } | null;
  estimatedWaitMinutes?: number;
  staffAssignedId: string | null;
  expectedServiceTime: number;
}

interface StaffMember {
  id: string;
  displayName?: string;
  name?: string;
  isActive?: boolean;
}

function minutesSince(ts: { toDate(): Date } | null): number {
  if (!ts) return 0;
  return Math.floor((Date.now() - ts.toDate().getTime()) / 60000);
}

export default function Queue() {
  const { orgId } = useAuth();

  const { data: queue, loading, error } = useFirestoreQuery<QueueEntry>(db, 'queueEntries', {
    where: [
      ['orgId', '==', orgId],
      ['status', 'in', ['waiting', 'in-service']],
    ],
    orderBy: [['checkInTime', 'asc']],
    enabled: !!orgId,
  });

  const { data: staff } = useFirestoreQuery<StaffMember>(db, 'staffMembers', {
    where: [
      ['orgId', '==', orgId],
      ['isActive', '==', true],
    ],
    enabled: !!orgId,
  });

  const { call: assignStaff, loading: assigning } = useCallable<object, { ok: boolean }>('queueAssignStaff');
  const { call: completeService, loading: completing } = useCallable<object, { ok: boolean }>('queueCompleteService');

  const waiting = useMemo(() => queue.filter((q) => q.status === 'waiting'), [queue]);
  const inService = useMemo(() => queue.filter((q) => q.status === 'in-service'), [queue]);
  const busyStaffIds = useMemo(() => new Set(inService.map((q) => q.staffAssignedId)), [inService]);
  const availableStaff = useMemo(() => staff.filter((s) => !busyStaffIds.has(s.id)), [staff, busyStaffIds]);

  const avgWait = waiting.length
    ? Math.round(waiting.reduce((s, q) => s + minutesSince(q.checkInTime), 0) / waiting.length)
    : 0;

  if (error) return <Alert kind="error" title="Couldn't load queue">{error.message}</Alert>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Queue</h1>
        <p className="text-sm text-gray-500">Live — updates in real time as clients check in.</p>
      </div>

      {loading ? (
        <Skeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Waiting" value={waiting.length} />
            <StatCard label="In Service" value={inService.length} />
            <StatCard label="Avg Wait" value={`${avgWait}m`} sub="current queue" />
            <StatCard label="Staff Free" value={availableStaff.length} sub={`of ${staff.length}`} />
          </div>

          {waiting.length > 3 && availableStaff.length > 0 && (
            <Alert kind="warning" title="Queue backing up">
              {waiting.length} clients waiting with {availableStaff.length} staff free — assign now to cut wait times.
            </Alert>
          )}

          <Card title={`Waiting (${waiting.length})`}>
            {waiting.length === 0 ? (
              <EmptyState message="No one waiting. 🎉" />
            ) : (
              <ul className="divide-y divide-gray-50">
                {waiting.map((entry, idx) => (
                  <li key={entry.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-gray-400 mr-2">#{idx + 1}</span>
                      <span className="font-medium text-gray-900">{entry.clientName}</span>
                      <span className="text-sm text-gray-500 ml-2">{entry.serviceName}</span>
                      <Badge color={minutesSince(entry.checkInTime) > 20 ? 'red' : 'gray'}>
                        waiting {minutesSince(entry.checkInTime)}m
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                        defaultValue=""
                        disabled={assigning}
                        onChange={(e) => {
                          if (e.target.value) {
                            assignStaff({ orgId, queueId: entry.id, staffId: e.target.value });
                          }
                        }}
                        aria-label={`Assign staff to ${entry.clientName}`}
                      >
                        <option value="" disabled>
                          Assign staff…
                        </option>
                        {availableStaff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.displayName || s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={`In Service (${inService.length})`}>
            {inService.length === 0 ? (
              <EmptyState message="No active services." />
            ) : (
              <ul className="divide-y divide-gray-50">
                {inService.map((entry) => {
                  const member = staff.find((s) => s.id === entry.staffAssignedId);
                  return (
                    <li key={entry.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{entry.clientName}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {entry.serviceName} with {member?.displayName || member?.name || 'staff'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={completing}
                        onClick={() => completeService({ orgId, queueId: entry.id })}
                      >
                        Complete
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
