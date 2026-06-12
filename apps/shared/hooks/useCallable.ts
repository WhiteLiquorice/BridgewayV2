/**
 * Thin wrapper around Firebase callable functions with loading/error state.
 *
 * const { call, loading, error } = useCallable<Req, Res>('forecastDemand');
 * const result = await call({ orgId, rangeStart, rangeEnd });
 */
import { useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

export function useCallable<TRequest, TResponse>(functionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (payload: TRequest): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const fn = httpsCallable<TRequest, TResponse>(getFunctions(), functionName);
        const result = await fn(payload);
        return result.data;
      } catch (err) {
        console.error(`Callable ${functionName} failed:`, err);
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [functionName]
  );

  return { call, loading, error };
}
