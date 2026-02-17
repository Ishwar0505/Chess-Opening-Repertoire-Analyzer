import { apiQueue } from './requestQueue';
import { cacheGet, cacheSet } from './cache';

const EXPLORER_URL = 'https://explorer.lichess.ovh';

/**
 * Query the masters database for a position defined by a sequence of UCI moves.
 * moves: "e2e4,e7e5,g1f3" (comma-separated UCI)
 */
export async function queryMasters(moves, options = {}) {
  const cacheKey = `masters_${moves}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams();
  if (moves) params.set('play', moves);
  if (options.since) params.set('since', options.since);
  if (options.until) params.set('until', options.until);
  params.set('moves', options.movesCount || 12);
  params.set('topGames', options.topGames || 5);

  const response = await apiQueue.enqueue(
    `${EXPLORER_URL}/masters?${params}`
  );
  const data = await response.json();

  cacheSet(cacheKey, data, 1440); // cache 24 hours
  return data;
}

/**
 * Query the Lichess player opening explorer.
 */
export async function queryPlayerOpenings(username, color, moves, options = {}) {
  const params = new URLSearchParams({
    player: username,
    color: color,
  });
  if (moves) params.set('play', moves);
  if (options.speeds) params.set('speeds', options.speeds);
  if (options.modes) params.set('modes', options.modes);
  if (options.since) params.set('since', options.since);
  if (options.until) params.set('until', options.until);
  params.set('moves', options.movesCount || 12);
  params.set('recentGames', options.recentGames || 4);

  const response = await apiQueue.enqueue(
    `${EXPLORER_URL}/player?${params}`
  );
  const data = await response.json();
  return data;
}

/**
 * Fetch a master game PGN by its ID.
 */
export async function fetchMasterGamePGN(gameId) {
  const cacheKey = `master_pgn_${gameId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const response = await apiQueue.enqueue(
    `${EXPLORER_URL}/master/pgn/${gameId}`
  );
  const pgn = await response.text();

  cacheSet(cacheKey, pgn, 10080); // cache 7 days
  return pgn;
}

/**
 * Query the Lichess games database (not masters, not player-specific).
 */
export async function queryLichessDB(moves, options = {}) {
  const params = new URLSearchParams();
  if (moves) params.set('play', moves);
  if (options.speeds) params.set('speeds', options.speeds);
  if (options.ratings) params.set('ratings', options.ratings);
  params.set('moves', options.movesCount || 12);

  const response = await apiQueue.enqueue(
    `${EXPLORER_URL}/lichess?${params}`
  );
  return response.json();
}
