import { useMemo } from 'react';
import { buildRepertoire, sortOpenings } from '../analysis/repertoire';

/**
 * Hook to build and sort the opening repertoire from games.
 *
 * @param {Array} games - Array of game objects
 * @param {string} username - Player's username
 * @param {string} activeColor - 'white' or 'black'
 * @param {string} sortBy - Sort criterion
 * @returns {{ repertoire, openings, totalGames }}
 */
export function useRepertoire(games, username, activeColor, sortBy) {
  const repertoire = useMemo(() => {
    if (!games.length || !username) return { white: [], black: [] };
    return buildRepertoire(games, username);
  }, [games, username]);

  const openings = useMemo(() => {
    const list = activeColor === 'white' ? repertoire.white : repertoire.black;
    return sortOpenings(list, sortBy);
  }, [repertoire, activeColor, sortBy]);

  const totalGames = useMemo(() => {
    const list = activeColor === 'white' ? repertoire.white : repertoire.black;
    return list.reduce((sum, o) => sum + o.games, 0);
  }, [repertoire, activeColor]);

  return { repertoire, openings, totalGames };
}
