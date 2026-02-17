/**
 * Lichess cloud evaluation API client.
 * Fetches Stockfish evaluations from the Lichess cloud analysis cache.
 */

import { lichessQueue } from './requestQueue';
import { cacheGet, cacheSet } from './cache';

const BASE_URL = 'https://lichess.org';

/**
 * Get cloud evaluation for a FEN position.
 * Returns the cached Stockfish evaluation if available.
 *
 * @param {string} fen - FEN string of the position
 * @param {Object} options - { multiPv: number of lines (1-5) }
 * @returns {Promise<Object|null>} Evaluation data or null if not available
 */
export async function getCloudEval(fen, options = {}) {
  if (!fen) return null;

  const cacheKey = `eval_${fen}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({ fen });
  if (options.multiPv) params.set('multiPv', options.multiPv);

  try {
    const response = await lichessQueue.enqueue(
      `${BASE_URL}/api/cloud-eval?${params}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const result = formatEval(data);

    cacheSet(cacheKey, result, 1440); // cache 24 hours
    return result;
  } catch {
    return null;
  }
}

/**
 * Format raw cloud eval response into a cleaner structure.
 */
function formatEval(data) {
  if (!data || !data.pvs || data.pvs.length === 0) return null;

  const mainLine = data.pvs[0];
  const isMate = mainLine.mate !== undefined && mainLine.mate !== null;

  return {
    depth: data.depth || 0,
    knodes: data.knodes || 0,
    cp: isMate ? null : mainLine.cp,
    mate: isMate ? mainLine.mate : null,
    pv: mainLine.moves || '',
    evalText: isMate
      ? `M${Math.abs(mainLine.mate)}`
      : formatCp(mainLine.cp),
    evalNum: isMate
      ? (mainLine.mate > 0 ? 999 : -999)
      : (mainLine.cp || 0) / 100,
    fen: data.fen || '',
  };
}

/**
 * Format centipawn value as a readable string.
 */
function formatCp(cp) {
  if (cp === undefined || cp === null) return '0.0';
  const value = cp / 100;
  return (value >= 0 ? '+' : '') + value.toFixed(1);
}
