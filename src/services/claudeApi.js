import { cacheGet, cacheSet } from './cache';

/**
 * Translate engine PV moves into a human-readable strategic plan.
 * Calls the /api/translate Vercel serverless function.
 *
 * @param {string} fen - FEN position
 * @param {string} pvMoves - Principal variation moves (space-separated)
 * @param {Object} context - { openingName, evalText }
 * @returns {Promise<string|null>} 1-sentence human plan, or null on failure
 */
export async function translateMoves(fen, pvMoves, context = {}) {
  if (!fen || !pvMoves) return null;

  // Aggressive caching: same position + PV = same plan
  const pvKey = pvMoves.split(/\s+/).slice(0, 5).join('_');
  const cacheKey = `translate_${fen}_${pvKey}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fen,
        pvMoves,
        openingName: context.openingName || '',
        evalText: context.evalText || '',
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const plan = data.plan || null;

    if (plan) {
      cacheSet(cacheKey, plan, 10080); // cache 7 days
    }

    return plan;
  } catch {
    return null;
  }
}
