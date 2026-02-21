import { useState } from 'react';
import { useOpponentScout } from '../../hooks/useOpponentScout';
import StatBar from '../common/StatBar';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './OpponentScout.module.css';

/**
 * Opponent scouting panel.
 * User enters an opponent's Lichess username to find repertoire intersections.
 *
 * @param {{ repertoire: { white: Array, black: Array } }} props
 */
export default function OpponentScout({ repertoire }) {
  const [opponentName, setOpponentName] = useState('');
  const { report, loading, progress, error, scout, reset } = useOpponentScout(repertoire);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (opponentName.trim()) {
      scout(opponentName);
    }
  };

  return (
    <section className={styles.panel} aria-label="Opponent scouting">
      <h3 className={styles.heading}>Opponent DNA</h3>
      <p className={styles.subtitle}>
        Scout an opponent to find where your repertoires overlap
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Opponent's Lichess username..."
          value={opponentName}
          onChange={(e) => setOpponentName(e.target.value)}
          disabled={loading}
          aria-label="Opponent username"
        />
        <button
          type="submit"
          className={styles.scoutButton}
          disabled={loading || !opponentName.trim()}
        >
          {loading ? `Scouting ${progress}...` : 'Scout'}
        </button>
        {report && (
          <button type="button" className={styles.resetButton} onClick={reset}>
            Clear
          </button>
        )}
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {loading && (
        <LoadingSpinner message={`Loading opponent games... ${progress} fetched`} />
      )}

      {report && !loading && (
        <div className={styles.results}>
          <p className={styles.resultsSummary}>
            Analyzed {report.totalGames} games for {report.opponentHandle}
          </p>

          {report.intersections.length === 0 ? (
            <p className={styles.noOverlap}>
              No overlapping openings found with this opponent.
            </p>
          ) : (
            <div className={styles.intersections}>
              <h4 className={styles.sectionTitle}>Critical Intersections</h4>
              {report.intersections.map((ix, i) => (
                <div key={`${ix.eco}-${ix.name}-${i}`} className={styles.intersection}>
                  <div className={styles.ixHeader}>
                    <span className={styles.ixRank}>#{i + 1}</span>
                    <span className={styles.ixEco}>{ix.eco}</span>
                    <span className={styles.ixName}>{ix.name}</span>
                    <span className={styles.ixOverlap}>
                      {ix.overlap === 'direct' ? 'Direct' : 'Transposition'}
                    </span>
                  </div>

                  <div className={styles.ixStats}>
                    <div className={styles.ixPlayer}>
                      <span className={styles.ixLabel}>You ({ix.userColor})</span>
                      <span className={styles.ixValue}>
                        {ix.userStats.games} games, {Math.round(ix.userStats.winRate * 100)}% wins
                      </span>
                      <StatBar
                        wins={ix.userStats.wins}
                        draws={ix.userStats.draws}
                        losses={ix.userStats.losses}
                        total={ix.userStats.games}
                      />
                    </div>

                    <div className={styles.ixPlayer}>
                      <span className={styles.ixLabel}>
                        {report.opponentHandle} ({ix.opponentColor})
                      </span>
                      <span className={styles.ixValue}>
                        {ix.opponentStats.games} games, {Math.round(ix.opponentStats.winRate * 100)}% wins
                      </span>
                      <StatBar
                        wins={ix.opponentStats.wins}
                        draws={ix.opponentStats.draws}
                        losses={ix.opponentStats.losses}
                        total={ix.opponentStats.games}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
