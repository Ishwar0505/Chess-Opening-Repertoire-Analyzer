import { useState, useCallback, useEffect, memo } from 'react';
import { createPosition, applyMove, sanToUci } from '../../utils/chess';
import Chessboard from '../Chessboard/Chessboard';
import styles from './GameViewer.module.css';

/**
 * Interactive PGN viewer with chessboard and move navigation.
 *
 * @param {Object} props
 * @param {string[]} props.moves - Array of SAN moves (e.g., ["e4", "e5", "Nf3"])
 * @param {boolean} [props.flipped=false] - Flip board orientation
 * @param {number} [props.startPly=0] - Initial ply to display
 * @param {number} [props.boardSize=320] - Board size in pixels
 * @param {Function} [props.onPlyChange] - Callback when ply changes
 */
function GameViewer({ moves = [], flipped = false, startPly = 0, boardSize = 320, onPlyChange }) {
  const [currentPly, setCurrentPly] = useState(startPly);

  // Build position history
  const { positions, uciMoves } = buildPositionHistory(moves);

  // Clamp ply to valid range
  const ply = Math.max(0, Math.min(currentPly, positions.length - 1));

  useEffect(() => {
    setCurrentPly(startPly);
  }, [startPly, moves]);

  const goTo = useCallback((newPly) => {
    const clamped = Math.max(0, Math.min(newPly, positions.length - 1));
    setCurrentPly(clamped);
    onPlyChange?.(clamped);
  }, [positions.length, onPlyChange]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(ply - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(ply + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(positions.length - 1);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [ply, positions.length, goTo]);

  const lastUci = ply > 0 ? uciMoves[ply - 1] : null;

  return (
    <div className={styles.viewer}>
      <Chessboard
        board={positions[ply]}
        flipped={flipped}
        size={boardSize}
        lastMove={lastUci}
      />

      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={() => goTo(0)}
          disabled={ply === 0}
          title="Start"
          aria-label="Go to start"
        >
          &#9198;
        </button>
        <button
          className={styles.navBtn}
          onClick={() => goTo(ply - 1)}
          disabled={ply === 0}
          title="Previous"
          aria-label="Previous move"
        >
          &#9664;
        </button>
        <span className={styles.plyDisplay}>
          {ply === 0 ? 'Start' : formatPly(ply)}
        </span>
        <button
          className={styles.navBtn}
          onClick={() => goTo(ply + 1)}
          disabled={ply >= positions.length - 1}
          title="Next"
          aria-label="Next move"
        >
          &#9654;
        </button>
        <button
          className={styles.navBtn}
          onClick={() => goTo(positions.length - 1)}
          disabled={ply >= positions.length - 1}
          title="End"
          aria-label="Go to end"
        >
          &#9197;
        </button>
      </div>

      {moves.length > 0 && (
        <div className={styles.moveList}>
          {moves.map((move, i) => {
            const moveNum = Math.floor(i / 2) + 1;
            const isWhite = i % 2 === 0;
            return (
              <span key={i}>
                {isWhite && <span className={styles.moveNum}>{moveNum}.</span>}
                <button
                  className={`${styles.moveBtn} ${i + 1 === ply ? styles.activeMoveBtn : ''}`}
                  onClick={() => goTo(i + 1)}
                >
                  {move}
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function buildPositionHistory(moves) {
  const pos = createPosition();
  const positions = [pos.board.map(r => [...r])];
  const uciMoves = [];

  for (const san of moves) {
    const uci = sanToUci(pos, san);
    applyMove(pos, san);
    uciMoves.push(uci);
    positions.push(pos.board.map(r => [...r]));
  }

  return { positions, uciMoves };
}

function formatPly(ply) {
  const moveNum = Math.ceil(ply / 2);
  return ply % 2 === 1 ? `${moveNum}.` : `${moveNum}...`;
}

export default memo(GameViewer);
