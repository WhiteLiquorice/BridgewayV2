/**
 * Real-time Firestore query hook with cleanup and error states.
 * Drop into /apps/shared (or each app's src/hooks) and import the app's
 * Firestore instance.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  Firestore,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';

export interface QueryOptions {
  where?: [string, WhereFilterOp, unknown][];
  orderBy?: [string, OrderByDirection][];
  limit?: number;
  /** Skip the query entirely (e.g. while orgId is loading). */
  enabled?: boolean;
}

export interface QueryResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export function useFirestoreQuery<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  options: QueryOptions = {}
): QueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stable key so the effect only re-runs when the query actually changes.
  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    if (options.enabled === false) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const constraints: QueryConstraint[] = [];
    (options.where || []).forEach(([field, op, value]) => constraints.push(where(field, op, value)));
    (options.orderBy || []).forEach(([field, dir]) => constraints.push(orderBy(field, dir)));
    if (options.limit) constraints.push(limit(options.limit));

    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ ...(doc.data() as object), id: doc.id }) as T));
        setLoading(false);
      },
      (err) => {
        console.error(`useFirestoreQuery(${collectionName}) failed:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionName, optionsKey]);

  return { data, loading, error };
}
