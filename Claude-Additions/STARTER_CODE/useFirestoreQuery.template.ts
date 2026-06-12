/**
 * useFirestoreQuery - Reusable hook for querying Firestore with real-time listeners
 *
 * Usage:
 * const { data, loading, error } = useFirestoreQuery('collectionName', {
 *   where: [['orgId', '==', orgId]],
 *   orderBy: [['createdAt', 'desc']],
 *   limit: 50
 * });
 */

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';

interface QueryOptions {
  where?: [string, string, any][];
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  startAfter?: any;
}

interface UseQueryResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
}

/**
 * Hook for querying Firestore collections with real-time listeners
 *
 * @param collectionName - Name of Firestore collection
 * @param options - Query options (where, orderBy, limit, etc.)
 * @param firebaseDb - Firestore instance (use default from context if available)
 */
export function useFirestoreQuery<T extends { id: string }>(
  collectionName: string,
  options: QueryOptions = {},
  firebaseDb?: Firestore
): UseQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firebaseDb) {
      setError(new Error('Firestore instance not provided'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query constraints
      const constraints: QueryConstraint[] = [];

      // Add where clauses
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          constraints.push(where(field, operator as any, value));
        });
      }

      // Add ordering
      if (options.orderBy) {
        options.orderBy.forEach(([field, direction]) => {
          constraints.push(orderBy(field, direction));
        });
      }

      // Add limit
      if (options.limit) {
        constraints.push(limit(options.limit));
      }

      // Create query
      const q = query(collection(firebaseDb, collectionName), ...constraints);

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          } as T));
          setData(docs);
          setLoading(false);
        },
        (err) => {
          console.error(`Error querying ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up query for ${collectionName}:`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, options, firebaseDb]);

  return { data, loading, error };
}

/**
 * Advanced hook with caching and pagination
 */
export function useFirestoreQueryPaginated<T extends { id: string }>(
  collectionName: string,
  pageSize: number = 50,
  options: Omit<QueryOptions, 'limit'> = {},
  firebaseDb?: Firestore
) {
  const [page, setPage] = useState(0);
  const [allData, setAllData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading: queryLoading, error: queryError } = useFirestoreQuery<T>(
    collectionName,
    { ...options, limit: pageSize * (page + 1) },
    firebaseDb
  );

  useEffect(() => {
    setAllData(data);
    setHasMore(data.length >= pageSize * (page + 1));
    setLoading(queryLoading);
    setError(queryError);
  }, [data, queryLoading, queryError, page, pageSize]);

  const loadMore = () => {
    setPage((p) => p + 1);
  };

  const currentPageData = allData.slice(page * pageSize, (page + 1) * pageSize);

  return {
    data: currentPageData,
    allData,
    page,
    loading,
    error,
    hasMore,
    loadMore,
  };
}

/**
 * Hook for a single document
 */
export function useFirestoreDocument<T extends { id: string }>(
  collectionName: string,
  docId: string,
  firebaseDb?: Firestore
): UseQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firebaseDb || !docId) {
      setLoading(false);
      return;
    }

    try {
      const docRef = collection(firebaseDb, collectionName);
      const q = query(docRef, where('id', '==', docId), limit(1));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            setData([]);
          } else {
            const doc = snapshot.docs[0];
            setData([{ ...doc.data(), id: doc.id } as T]);
          }
          setLoading(false);
        },
        (err) => {
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, docId, firebaseDb]);

  return { data, loading, error };
}
