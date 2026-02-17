import { useState, useCallback, useRef } from 'react';
import { streamPlayerGames } from '../services/lichessApi';

/**
 * Hook to stream and collect a player's games with progress tracking.
 */
export function usePlayerGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0 });
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const loadGames = useCallback(async (username, options = {}) => {
    setLoading(true);
    setError(null);
    setGames([]);
    setProgress({ loaded: 0 });
    abortRef.current = false;

    try {
      const collected = [];
      const gameStream = streamPlayerGames(username, options);

      for await (const game of gameStream) {
        if (abortRef.current) break;
        collected.push(game);
        setProgress({ loaded: collected.length });
      }

      setGames(collected);
      return collected;
    } catch (err) {
      setError(err.message || 'Failed to load games');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  const reset = useCallback(() => {
    setGames([]);
    setProgress({ loaded: 0 });
    setError(null);
  }, []);

  return { games, loading, progress, error, loadGames, abort, reset };
}
