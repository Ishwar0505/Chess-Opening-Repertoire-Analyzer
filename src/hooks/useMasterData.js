import { useState, useEffect, useRef } from 'react';
import { getMasterStats, analyzeOpeningMoves } from '../analysis/masterMatch';

/**
 * Hook to progressively fetch master database stats for a list of openings.
 * Used by Dashboard to show master game counts in the table.
 *
 * @param {Array} openings - Array of opening entries from the repertoire
 * @param {string} username - Current username (used as reset signal)
 * @returns {{ masterData: Object, loading: boolean }}
 */
export function useMasterData(openings, username) {
  const [masterData, setMasterData] = useState({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(false);
  const fetchedRef = useRef(new Set());

  // Reset when username changes
  useEffect(() => {
    setMasterData({});
    fetchedRef.current = new Set();
  }, [username]);

  useEffect(() => {
    if (!openings || openings.length === 0) return;

    const toFetch = openings.filter(o => {
      const key = `${o.eco}|${o.name}`;
      return o.moves && !fetchedRef.current.has(key);
    });

    if (toFetch.length === 0) return;

    abortRef.current = false;
    setLoading(true);

    (async () => {
      for (const opening of toFetch) {
        if (abortRef.current) break;

        const key = `${opening.eco}|${opening.name}`;
        fetchedRef.current.add(key);

        try {
          const stats = await getMasterStats(opening.moves);
          if (abortRef.current) break;
          if (stats) {
            setMasterData(prev => ({ ...prev, [key]: stats }));
          }
        } catch {
          // Skip failures silently
        }
      }
      if (!abortRef.current) setLoading(false);
    })();

    return () => { abortRef.current = true; };
  }, [openings, username]);

  return { masterData, loading };
}

/**
 * Hook to perform detailed move-by-move analysis for a selected opening.
 * Used by OpeningCard for the move comparison view.
 *
 * @param {Object|null} opening - The selected opening entry
 * @returns {{ analysis: Object|null, loading: boolean }}
 */
export function useOpeningAnalysis(opening) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opening?.moves) {
      setAnalysis(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setAnalysis(null);

    analyzeOpeningMoves(opening.moves)
      .then(result => {
        if (!cancelled) {
          setAnalysis(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [opening?.eco, opening?.name, opening?.moves]);

  return { analysis, loading };
}
