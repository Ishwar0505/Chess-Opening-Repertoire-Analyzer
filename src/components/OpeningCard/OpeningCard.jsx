import { useState, useEffect } from 'react';
import { useOpeningAnalysis } from '../../hooks/useMasterData';
import { getMasterStats, fetchTopGamePGNs } from '../../analysis/masterMatch';
import { parsePGN } from '../../utils/chess';
import StatBar from '../common/StatBar';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './OpeningCard.module.css';

function resultLabel(winner) {
  if (winner === 'white') return '1-0';
  if (winner === 'black') return '0-1';
  return '\u00BD-\u00BD';
}

export default function OpeningCard({ opening }) {
  const [masterStats, setMasterStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [topGames, setTopGames] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const { analysis, loading: analysisLoading } = useOpeningAnalysis(opening);

  // Fetch master stats when opening changes
  useEffect(() => {
    if (!opening?.moves) {
      setMasterStats(null);
      setTopGames(null);
      return;
    }

    let cancelled = false;
    setStatsLoading(true);
    setTopGames(null);
    setExpandedGame(null);

    getMasterStats(opening.moves)
      .then(stats => {
        if (cancelled) return;
        setMasterStats(stats);
        setStatsLoading(false);

        // Fetch PGNs for top games
        if (stats?.topGames?.length > 0) {
          fetchTopGamePGNs(stats.topGames).then(games => {
            if (!cancelled) setTopGames(games);
          });
        }
      })
      .catch(() => {
        if (!cancelled) setStatsLoading(false);
      });

    return () => { cancelled = true; };
  }, [opening?.eco, opening?.name, opening?.moves]);

  if (!opening) return null;

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <span className={styles.eco}>{opening.eco}</span>
        <h3 className={styles.name}>{opening.name}</h3>
      </header>

      <div className={styles.statsGrid}>
        {/* Player performance */}
        <div className={styles.statsSection}>
          <h4 className={styles.sectionTitle}>Your Performance</h4>
          <div className={styles.statRow}>
            <span>{opening.games} games</span>
            <span>{Math.round(opening.winRate * 100)}% win rate</span>
          </div>
          <StatBar
            wins={opening.wins}
            draws={opening.draws}
            losses={opening.losses}
            total={opening.games}
          />
          {opening.avgOpponentRating > 0 && (
            <p className={styles.statDetail}>
              Avg opponent: {opening.avgOpponentRating}
            </p>
          )}
        </div>

        {/* Master database stats */}
        <div className={styles.statsSection}>
          <h4 className={styles.sectionTitle}>Masters Database</h4>
          {statsLoading ? (
            <LoadingSpinner message="Loading master data..." />
          ) : masterStats ? (
            <>
              <div className={styles.statRow}>
                <span>{masterStats.totalGames.toLocaleString()} master games</span>
              </div>
              {masterStats.totalGames > 0 && (
                <StatBar
                  wins={masterStats.whiteWins}
                  draws={masterStats.draws}
                  losses={masterStats.blackWins}
                  total={masterStats.totalGames}
                />
              )}
              {masterStats.masterMoves.length > 0 && (
                <div className={styles.masterMoves}>
                  <p className={styles.movesLabel}>Popular continuations:</p>
                  {masterStats.masterMoves.slice(0, 3).map(m => (
                    <span key={m.uci} className={styles.moveChip}>
                      {m.san} ({m.games.toLocaleString()})
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className={styles.statDetail}>No master data available</p>
          )}
        </div>
      </div>

      {/* Move-by-move comparison */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          Move Comparison
          {analysis && (
            <span className={styles.matchBadge}>
              {analysis.matchPercent}% match
            </span>
          )}
        </h4>
        {analysisLoading ? (
          <LoadingSpinner message="Analyzing moves..." />
        ) : analysis && analysis.comparisons.length > 0 ? (
          <div className={styles.moveList}>
            {analysis.comparisons.map((c, i) => (
              <div
                key={i}
                className={`${styles.moveItem} ${c.matches ? styles.moveMatch : c.isInMasterDB ? styles.moveAlt : styles.moveDiverge}`}
              >
                <span className={styles.moveNumber}>
                  {c.color === 'white' ? `${Math.ceil(c.ply / 2)}.` : '...'}
                </span>
                <span className={styles.moveText}>{c.playerMove}</span>
                {c.matches ? (
                  <span className={styles.moveStatus} title="Matches top master choice">
                    &#10003;
                  </span>
                ) : c.masterMoves.length > 0 ? (
                  <span className={styles.moveStatus} title={`Master prefers: ${c.masterMoves[0].san}`}>
                    {c.masterMoves[0].san}
                  </span>
                ) : (
                  <span className={styles.moveStatus} title="Not in master database">
                    &#8212;
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : !analysisLoading ? (
          <p className={styles.statDetail}>No move data available</p>
        ) : null}
      </div>

      {/* Top master games */}
      {topGames && topGames.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Notable Master Games</h4>
          <div className={styles.gameList}>
            {topGames.map(game => (
              <div key={game.id} className={styles.gameEntry}>
                <button
                  className={styles.gameButton}
                  onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                >
                  <span className={styles.gamePlayers}>
                    {game.white?.name || '?'} ({game.white?.rating || '?'})
                    {' vs '}
                    {game.black?.name || '?'} ({game.black?.rating || '?'})
                  </span>
                  <span className={styles.gameMeta}>
                    {game.year || '?'} &middot; {resultLabel(game.winner)}
                  </span>
                </button>
                {expandedGame === game.id && game.pgn && (
                  <div className={styles.gamePgn}>
                    <PgnDisplay pgn={game.pgn} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PgnDisplay({ pgn }) {
  const { headers, moves } = parsePGN(pgn);
  const event = headers.Event || '';
  const site = headers.Site || '';

  return (
    <div className={styles.pgnContent}>
      {(event || site) && (
        <p className={styles.pgnHeader}>
          {event}{site ? `, ${site}` : ''}
        </p>
      )}
      <p className={styles.pgnMoves}>
        {moves.map((m, i) => (
          <span key={i}>
            {i % 2 === 0 && <span className={styles.pgnMoveNum}>{Math.floor(i / 2) + 1}.</span>}
            {m}{' '}
          </span>
        ))}
        {headers.Result && <span className={styles.pgnResult}>{headers.Result}</span>}
      </p>
    </div>
  );
}
