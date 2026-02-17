import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { fetchPlayerProfile, streamPlayerGames } from '../../services/lichessApi';
import styles from './SearchBar.module.css';

const PERF_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'bullet', label: 'Bullet' },
  { value: 'blitz', label: 'Blitz' },
  { value: 'rapid', label: 'Rapid' },
  { value: 'classical', label: 'Classical' },
];

export default function SearchBar() {
  const { gamesLoading, gamesProgress } = useAppState();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [perfType, setPerfType] = useState('all');
  const [maxGames, setMaxGames] = useState(200);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) return;

    const filters = { perfType, color: 'both', maxGames };

    dispatch({ type: 'FETCH_START', username: trimmed, filters });

    try {
      // Fetch profile
      const profile = await fetchPlayerProfile(trimmed);
      dispatch({ type: 'PROFILE_LOADED', profile });

      // Stream games
      const gameStream = streamPlayerGames(
        trimmed,
        { max: maxGames, perfType },
        (count) => {} // progress tracked via GAME_RECEIVED dispatches
      );

      for await (const game of gameStream) {
        dispatch({ type: 'GAME_RECEIVED', game });
      }

      dispatch({ type: 'GAMES_COMPLETE' });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        error: err.message || 'Failed to fetch player data',
      });
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.usernameInput}
          placeholder="Lichess username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={gamesLoading}
        />

        <select
          className={styles.select}
          value={perfType}
          onChange={(e) => setPerfType(e.target.value)}
          disabled={gamesLoading}
        >
          {PERF_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>

        <div className={styles.gamesSlider}>
          <label htmlFor="maxGames">Games: {maxGames}</label>
          <input
            id="maxGames"
            type="range"
            min={50}
            max={500}
            step={50}
            value={maxGames}
            onChange={(e) => setMaxGames(Number(e.target.value))}
            disabled={gamesLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.analyzeButton}
          disabled={gamesLoading || !username.trim()}
        >
          {gamesLoading ? `Loading ${gamesProgress.loaded}...` : 'Analyze'}
        </button>
      </div>
    </form>
  );
}
