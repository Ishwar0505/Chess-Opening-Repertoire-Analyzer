import { useState, useCallback, useRef } from 'react';
import { scoutOpponent } from '../analysis/opponentDNA';

/**
 * Hook to scout an opponent and find critical repertoire intersections.
 *
 * @param {{ white: Array, black: Array }} userRepertoire - User's full repertoire
 * @returns {{ report, loading, progress, error, scout, reset }}
 */
export function useOpponentScout(userRepertoire) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const scout = useCallback(async (opponentHandle) => {
    if (!opponentHandle?.trim() || !userRepertoire) return;

    setLoading(true);
    setError(null);
    setReport(null);
    setProgress(0);
    abortRef.current = false;

    try {
      const result = await scoutOpponent(
        opponentHandle.trim(),
        userRepertoire,
        {
          max: 100,
          onProgress: (count) => {
            if (!abortRef.current) setProgress(count);
          },
        }
      );

      if (!abortRef.current) {
        setReport(result);
      }
    } catch (err) {
      if (!abortRef.current) {
        setError(err.message || 'Failed to scout opponent');
      }
    } finally {
      if (!abortRef.current) {
        setLoading(false);
      }
    }
  }, [userRepertoire]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setReport(null);
    setLoading(false);
    setProgress(0);
    setError(null);
  }, []);

  return { report, loading, progress, error, scout, reset };
}
