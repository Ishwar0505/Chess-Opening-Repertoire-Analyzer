import { useState, useEffect, useRef } from 'react';
import { analyzePracticalityGap } from '../analysis/practicalityGap';

/**
 * Hook to analyze the engine-human discrepancy for a single opening.
 * Used by OpeningCard for the detailed danger zone display.
 *
 * @param {Object|null} opening - The selected opening entry
 * @returns {{ gap: Object|null, loading: boolean }}
 */
export function usePracticalityGap(opening) {
  const [gap, setGap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opening?.moves) {
      setGap(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setGap(null);

    analyzePracticalityGap(opening)
      .then(result => {
        if (!cancelled) {
          setGap(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [opening?.eco, opening?.name, opening?.moves]);

  return { gap, loading };
}

/**
 * Hook to progressively fetch danger zone status for a list of openings.
 * Used by Dashboard to show danger badges in the table.
 * Follows the same pattern as useMasterData.
 *
 * @param {Array} openings - Array of opening entries
 * @param {string} username - Current username (reset signal)
 * @returns {{ dangerData: Object, loading: boolean }}
 */
export function useDangerZoneData(openings, username) {
  const [dangerData, setDangerData] = useState({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(false);
  const fetchedRef = useRef(new Set());

  // Reset when username changes
  useEffect(() => {
    setDangerData({});
    fetchedRef.current = new Set();
  }, [username]);

  useEffect(() => {
    if (!openings || openings.length === 0) return;

    // Limit to top 10 openings by frequency to avoid excessive API calls
    const toFetch = openings.slice(0, 10).filter(o => {
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
          const result = await analyzePracticalityGap(opening);
          if (abortRef.current) break;
          if (result) {
            setDangerData(prev => ({ ...prev, [key]: result }));
          }
        } catch {
          // Skip failures silently
        }
      }
      if (!abortRef.current) setLoading(false);
    })();

    return () => { abortRef.current = true; };
  }, [openings, username]);

  return { dangerData, loading };
}
