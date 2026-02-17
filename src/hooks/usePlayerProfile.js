import { useState, useCallback } from 'react';
import { fetchPlayerProfile } from '../services/lichessApi';

/**
 * Hook to fetch and manage a player's Lichess profile.
 */
export function usePlayerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async (username) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPlayerProfile(username);
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return { profile, loading, error, loadProfile, reset };
}
