import { lichessQueue } from './requestQueue';
import { cacheGet, cacheSet } from './cache';
import { parseNdjsonStream } from '../utils/stream';

const BASE_URL = 'https://lichess.org';

/**
 * Fetch a player's public profile.
 */
export async function fetchPlayerProfile(username) {
  const cacheKey = `profile_${username.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const response = await lichessQueue.enqueue(`${BASE_URL}/api/user/${username}`);
  const profile = await response.json();

  cacheSet(cacheKey, profile, 60); // cache 1 hour
  return profile;
}

/**
 * Stream a player's games as an async generator.
 * Yields one game object at a time.
 */
export async function* streamPlayerGames(username, options = {}, onProgress) {
  const params = new URLSearchParams({
    opening: 'true',
    moves: 'true',
    pgnInJson: 'true',
    tags: 'true',
    clocks: 'false',
    evals: 'false',
  });

  if (options.max) params.set('max', options.max);
  if (options.perfType && options.perfType !== 'all') {
    params.set('perfType', options.perfType);
  }
  if (options.color && options.color !== 'both') {
    params.set('color', options.color);
  }
  if (options.since) params.set('since', options.since);
  if (options.until) params.set('until', options.until);
  if (options.rated !== undefined) params.set('rated', options.rated);

  const url = `${BASE_URL}/api/games/user/${username}?${params}`;

  const response = await lichessQueue.enqueue(url, {
    headers: { Accept: 'application/x-ndjson' },
  });

  yield* parseNdjsonStream(response, onProgress);
}

/**
 * Export a single game by ID.
 */
export async function fetchGame(gameId) {
  const cacheKey = `game_${gameId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const response = await lichessQueue.enqueue(
    `${BASE_URL}/game/export/${gameId}`,
    { headers: { Accept: 'application/json' } }
  );
  const game = await response.json();

  cacheSet(cacheKey, game, 1440); // cache 24 hours
  return game;
}
