/**
 * Strategy engine — looks up opening themes by ECO code and generates insights.
 */

import THEMES from '../data/openingThemes.js';

/**
 * Compare ECO codes lexicographically.
 * "B01" < "B10" < "C00"
 */
function ecoCompare(a, b) {
  return a.localeCompare(b);
}

/**
 * Find the best matching theme entry for a given ECO code.
 * Tries exact range match first, then broadest matching range.
 */
export function findTheme(eco) {
  if (!eco) return null;

  const upper = eco.toUpperCase();
  let best = null;

  for (const theme of THEMES) {
    const [start, end] = theme.eco;
    if (ecoCompare(upper, start) >= 0 && ecoCompare(upper, end) <= 0) {
      // Prefer the narrower range (more specific match)
      if (!best || rangeSize(theme.eco) < rangeSize(best.eco)) {
        best = theme;
      }
    }
  }

  return best;
}

function rangeSize([start, end]) {
  // Approximate range size for comparison
  const s = start.charCodeAt(0) * 100 + parseInt(start.slice(1), 10);
  const e = end.charCodeAt(0) * 100 + parseInt(end.slice(1), 10);
  return e - s;
}

/**
 * Get strategic insights for an opening.
 *
 * @param {string} eco - ECO code (e.g., "B33")
 * @param {string} color - 'white' or 'black' (the player's color)
 * @returns {Object|null} Strategic insights or null if no theme found
 */
export function getStrategyInsights(eco, color) {
  const theme = findTheme(eco);
  if (!theme) return null;

  const playerColor = color || 'white';
  const opponentColor = playerColor === 'white' ? 'black' : 'white';

  return {
    family: theme.family,
    structures: theme.structures || [],
    middlegameIdeas: theme.middlegame?.[playerColor] || [],
    opponentPlans: theme.middlegame?.[opponentColor] || [],
    attackingStrategies: theme.attacking || [],
    tacticalMotifs: theme.tactics || [],
  };
}
