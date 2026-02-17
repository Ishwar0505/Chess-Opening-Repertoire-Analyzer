/**
 * Master database matching and comparison logic.
 * Queries the Lichess masters explorer and compares player moves with master preferences.
 */

import { sanMovesToUci, createPosition, applyMove } from '../utils/chess';
import { queryMasters, fetchMasterGamePGN } from '../services/explorerApi';

/**
 * Get master database statistics for an opening position.
 * Queries the masters explorer at the position reached after the given SAN moves.
 *
 * @param {string} sanMoves - Space-separated SAN moves (e.g., "e4 e5 Nf3 Nc6 Bb5")
 * @returns {Promise<Object>} Master stats at this position
 */
export async function getMasterStats(sanMoves) {
  if (!sanMoves) return null;

  const uci = sanMovesToUci(sanMoves);
  if (!uci) return null;

  const data = await queryMasters(uci, { topGames: 5, movesCount: 5 });

  return {
    totalGames: (data.white || 0) + (data.draws || 0) + (data.black || 0),
    whiteWins: data.white || 0,
    draws: data.draws || 0,
    blackWins: data.black || 0,
    topGames: data.topGames || [],
    masterMoves: (data.moves || []).map(m => ({
      san: m.san,
      uci: m.uci,
      games: (m.white || 0) + (m.draws || 0) + (m.black || 0),
      whiteWins: m.white || 0,
      draws: m.draws || 0,
      blackWins: m.black || 0,
    })),
    opening: data.opening || null,
  };
}

/**
 * Analyze move-by-move comparison with master preferences.
 * For each move in the opening, checks if the player's move matches
 * the most popular master move at that position.
 *
 * @param {string} sanMoves - Space-separated SAN opening moves
 * @returns {Promise<{ comparisons: Array, matchPercent: number }>}
 */
export async function analyzeOpeningMoves(sanMoves) {
  const moves = typeof sanMoves === 'string'
    ? sanMoves.split(/\s+/).filter(Boolean)
    : sanMoves;

  if (moves.length === 0) return { comparisons: [], matchPercent: 0 };

  const pos = createPosition();
  const comparisons = [];
  const uciSoFar = [];

  for (const san of moves) {
    const uciString = uciSoFar.join(',');

    let data;
    try {
      data = await queryMasters(uciString || undefined, { topGames: 0, movesCount: 5 });
    } catch {
      // If the query fails, skip this move
      const playerUci = applyMove(pos, san);
      if (playerUci) uciSoFar.push(playerUci);
      continue;
    }

    // Apply the move and get UCI
    const playerUci = applyMove(pos, san);
    if (!playerUci) break;
    uciSoFar.push(playerUci);

    const masterMoves = data.moves || [];
    const topMasterMove = masterMoves[0];
    const totalAtPosition = (data.white || 0) + (data.draws || 0) + (data.black || 0);

    comparisons.push({
      ply: comparisons.length + 1,
      color: comparisons.length % 2 === 0 ? 'white' : 'black',
      playerMove: san,
      playerUci,
      matches: !!(topMasterMove && topMasterMove.uci === playerUci),
      isInMasterDB: masterMoves.some(m => m.uci === playerUci),
      masterMoves: masterMoves.slice(0, 3).map(m => ({
        san: m.san,
        uci: m.uci,
        games: (m.white || 0) + (m.draws || 0) + (m.black || 0),
      })),
      masterGamesAtPosition: totalAtPosition,
    });
  }

  const matchCount = comparisons.filter(c => c.matches).length;
  const matchPercent = comparisons.length > 0
    ? Math.round((matchCount / comparisons.length) * 100)
    : 0;

  return { comparisons, matchPercent };
}

/**
 * Fetch PGN details for top master games.
 * @param {Array} topGames - Array of top game objects from the masters explorer
 * @returns {Promise<Array>} Games with PGN text added
 */
export async function fetchTopGamePGNs(topGames) {
  if (!topGames || topGames.length === 0) return [];

  const results = [];
  for (const game of topGames) {
    try {
      const pgn = await fetchMasterGamePGN(game.id);
      results.push({ ...game, pgn });
    } catch {
      results.push({ ...game, pgn: null });
    }
  }
  return results;
}
