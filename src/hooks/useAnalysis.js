import { useMemo } from 'react';
import { getStrategyInsights } from '../analysis/strategy';

/**
 * Hook to get strategic analysis for an opening.
 * Combines ECO theme data with the player's color context.
 *
 * @param {Object|null} opening - The selected opening entry
 * @param {string} activeColor - 'white' or 'black'
 * @returns {{ strategy: Object|null }}
 */
export function useAnalysis(opening, activeColor) {
  const strategy = useMemo(() => {
    if (!opening?.eco) return null;
    return getStrategyInsights(opening.eco, activeColor);
  }, [opening?.eco, activeColor]);

  return { strategy };
}
