/**
 * Kiosk Queue Display — client-facing position + wait time after check-in.
 * Touch-first: large text, high contrast, no small targets.
 * (Tier 1, Queue Management + Tier 2, Mobile Kiosk)
 */
import React, { useMemo } from 'react';
import { db } from '../lib/firebase';
import { useFirestoreQuery } from '../../../shared/hooks/useFirestoreQuery';

interface QueueEntry {
  id: string;
  clientName: string;
  status: 'waiting' | 'in-service';
  checkInTime: { toDate(): Date } | null;
  expectedServiceTime: number;
}

interface QueueDisplayProps {
  orgId: string;
  /** The queue entry id returned from check-in. */
  queueId: string;
  onDone?: () => void;
}

const WAIT_MESSAGES = [
  "Relax — we'll be with you soon!",
  'Grab a seat and unwind.',
  'Almost there — thanks for your patience!',
];

export default function QueueDisplay({ orgId, queueId, onDone }: QueueDisplayProps) {
  const { data: queue, loading } = useFirestoreQuery<QueueEntry>(db, 'queueEntries', {
    where: [
      ['orgId', '==', orgId],
      ['status', 'in', ['waiting', 'in-service']],
    ],
    orderBy: [['checkInTime', 'asc']],
  });

  const { position, estimatedWait, myEntry } = useMemo(() => {
    const waiting = queue.filter((q) => q.status === 'waiting');
    const idx = waiting.findIndex((q) => q.id === queueId);
    const entry = queue.find((q) => q.id === queueId);

    // Simple client-side estimate: sum expected times of those ahead.
    const aheadMinutes = waiting.slice(0, Math.max(0, idx)).reduce((s, q) => s + (q.expectedServiceTime || 30), 0);
    const inServiceCount = queue.filter((q) => q.status === 'in-service').length || 1;

    return {
      position: idx >= 0 ? idx + 1 : null,
      estimatedWait: idx >= 0 ? Math.round(aheadMinutes / inServiceCount) : 0,
      myEntry: entry,
    };
  }, [queue, queueId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-2xl text-gray-600">Checking you in…</p>
      </div>
    );
  }

  // Entry left the queue → service started or completed.
  if (!myEntry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <span className="text-7xl">✅</span>
        <h1 className="text-4xl font-bold text-gray-900">You're all set!</h1>
        <p className="text-2xl text-gray-600">Thanks for visiting.</p>
        {onDone && (
          <button
            onClick={onDone}
            className="mt-4 px-10 py-5 bg-indigo-600 text-white text-2xl font-semibold rounded-2xl active:bg-indigo-800"
          >
            Done
          </button>
        )}
      </div>
    );
  }

  if (myEntry.status === 'in-service') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <span className="text-7xl">💆</span>
        <h1 className="text-4xl font-bold text-gray-900">It's your turn, {myEntry.clientName}!</h1>
        <p className="text-2xl text-gray-600">Your provider is ready for you.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
      <h1 className="text-3xl font-bold text-gray-900">You're checked in, {myEntry.clientName}!</h1>

      <div className="flex gap-6">
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-sm px-10 py-8">
          <p className="text-xl text-gray-500 mb-1">Your position</p>
          <p className="text-7xl font-bold text-indigo-600">#{position}</p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-sm px-10 py-8">
          <p className="text-xl text-gray-500 mb-1">Estimated wait</p>
          <p className="text-7xl font-bold text-indigo-600">
            {estimatedWait}
            <span className="text-3xl font-medium text-gray-400 ml-1">min</span>
          </p>
        </div>
      </div>

      <p className="text-2xl text-gray-500">
        {WAIT_MESSAGES[(position || 1) % WAIT_MESSAGES.length]}
      </p>
    </div>
  );
}

