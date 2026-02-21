import { useState, useEffect } from 'react';
import { translateMoves } from '../services/claudeApi';

/**
 * Hook to get a human-readable strategic plan from engine PV.
 *
 * @param {string|null} fen - FEN position
 * @param {string|null} pv - Principal variation (space-separated moves)
 * @param {Object} context - { openingName, evalText }
 * @returns {{ plan: string|null, loading: boolean }}
 */
export function useStrategicTranslation(fen, pv, context = {}) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fen || !pv) {
      setPlan(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setPlan(null);

    translateMoves(fen, pv, context)
      .then(result => {
        if (!cancelled) {
          setPlan(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [fen, pv]);

  return { plan, loading };
}
