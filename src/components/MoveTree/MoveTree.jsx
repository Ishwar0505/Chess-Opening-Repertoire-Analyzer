import { useState, memo } from 'react';
import { createPosition, applyMove } from '../../utils/chess';
import Chessboard from '../Chessboard/Chessboard';
import styles from './MoveTree.module.css';

/**
 * Player vs master move comparison with integrated chessboard.
 * Shows the opening moves side by side with a board that updates on hover/click.
 *
 * @param {Object} props
 * @param {Object[]} props.comparisons - From analyzeOpeningMoves()
 * @param {number} props.matchPercent - Overall match percentage
 * @param {string} props.playerMoves - SAN move string from the opening
 */
function MoveTree({ comparisons = [], matchPercent, playerMoves = '' }) {
  const [activePly, setActivePly] = useState(0);

  const moves = playerMoves.split(/\s+/).filter(Boolean);
  const { positions, uciMoves } = buildHistory(moves);

  const ply = Math.max(0, Math.min(activePly, positions.length - 1));

  return (
    <div className={styles.container}>
      <div className={styles.boardPanel}>
        <Chessboard
          board={positions[ply]}
          size={280}
          lastMove={ply > 0 ? uciMoves[ply - 1] : null}
        />
        <p className={styles.posLabel}>
          {ply === 0 ? 'Starting position' : `After ${formatPly(ply, moves[ply - 1])}`}
        </p>
      </div>

      <div className={styles.treePanel}>
        <div className={styles.treeHeader}>
          <span className={styles.treeTitle}>Move-by-Move Comparison</span>
          <span className={styles.matchLabel}>
            {matchPercent}% match
          </span>
        </div>

        <div className={styles.treeGrid}>
          <div className={styles.treeGridHeader}>
            <span>#</span>
            <span>Your Move</span>
            <span>Master Choice</span>
            <span>Status</span>
          </div>

          {comparisons.map((c, i) => {
            const moveNum = c.color === 'white'
              ? `${Math.ceil(c.ply / 2)}.`
              : `${Math.ceil(c.ply / 2)}...`;

            const statusClass = c.matches
              ? styles.statusMatch
              : c.isInMasterDB
                ? styles.statusAlt
                : styles.statusDiverge;

            return (
              <button
                key={i}
                className={`${styles.treeRow} ${c.ply === ply ? styles.activeRow : ''}`}
                onMouseEnter={() => setActivePly(c.ply)}
                onClick={() => setActivePly(c.ply)}
              >
                <span className={styles.moveNum}>{moveNum}</span>
                <span className={styles.playerMove}>{c.playerMove}</span>
                <span className={styles.masterMove}>
                  {c.matches
                    ? c.playerMove
                    : c.masterMoves.length > 0
                      ? c.masterMoves[0].san
                      : '\u2014'}
                </span>
                <span className={`${styles.status} ${statusClass}`}>
                  {c.matches ? '\u2713' : c.isInMasterDB ? 'alt' : 'new'}
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotMatch}`} /> Matches top choice
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotAlt}`} /> Alternative in DB
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotDiverge}`} /> Not in master DB
          </span>
        </div>
      </div>
    </div>
  );
}

function buildHistory(moves) {
  const pos = createPosition();
  const positions = [pos.board.map(r => [...r])];
  const uciMoves = [];

  for (const san of moves) {
    const uci = applyMove(pos, san);
    uciMoves.push(uci);
    positions.push(pos.board.map(r => [...r]));
  }

  return { positions, uciMoves };
}

function formatPly(ply, san) {
  const num = Math.ceil(ply / 2);
  return ply % 2 === 1 ? `${num}. ${san}` : `${num}... ${san}`;
}

export default memo(MoveTree);
