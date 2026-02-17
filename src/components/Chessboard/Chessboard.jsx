import { memo } from 'react';
import { getPieceSvgData } from '../../data/piecesSvg';
import styles from './Chessboard.module.css';

const FILES = 'abcdefgh';
const RANKS = '12345678';

function PieceSvg({ piece, size }) {
  const data = getPieceSvgData(piece);
  if (!data) return null;

  return (
    <svg
      viewBox={data.viewBox}
      width={size}
      height={size}
      className={styles.piece}
    >
      {data.paths.map((p, i) => (
        <path key={i} d={p.d} style={parseStyle(p.style)} />
      ))}
    </svg>
  );
}

function parseStyle(styleStr) {
  if (!styleStr) return {};
  const obj = {};
  for (const part of styleStr.split(';')) {
    const [key, val] = part.split(':').map(s => s.trim());
    if (key && val) {
      obj[toCamelCase(key)] = val;
    }
  }
  return obj;
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * SVG Chessboard component.
 *
 * @param {Object} props
 * @param {Array<Array<string|null>>} props.board - 8x8 board array (row 0 = rank 1)
 * @param {boolean} [props.flipped=false] - Whether to flip the board (black's perspective)
 * @param {number} [props.size=320] - Board size in pixels
 * @param {string} [props.lastMove] - UCI of last move to highlight (e.g., "e2e4")
 */
function Chessboard({ board, flipped = false, size = 320, lastMove }) {
  const sqSize = size / 8;

  // Parse last move for highlighting
  let highlightSquares = null;
  if (lastMove && lastMove.length >= 4) {
    highlightSquares = [
      lastMove.slice(0, 2),
      lastMove.slice(2, 4),
    ];
  }

  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const rank = flipped ? row : 7 - row;
      const file = flipped ? 7 - col : col;
      const isLight = (rank + file) % 2 !== 0;
      const sqName = FILES[file] + RANKS[rank];
      const piece = board[rank]?.[file];

      const isHighlighted = highlightSquares && (
        sqName === highlightSquares[0] || sqName === highlightSquares[1]
      );

      squares.push(
        <g key={sqName} transform={`translate(${col * sqSize}, ${row * sqSize})`}>
          <rect
            width={sqSize}
            height={sqSize}
            className={isHighlighted ? styles.highlighted : (isLight ? styles.lightSquare : styles.darkSquare)}
          />
          {piece && (
            <g transform={`translate(${(sqSize - sqSize * 0.85) / 2}, ${(sqSize - sqSize * 0.85) / 2})`}>
              <PieceSvg piece={piece} size={sqSize * 0.85} />
            </g>
          )}
        </g>
      );
    }
  }

  // File and rank labels
  const labels = [];
  for (let i = 0; i < 8; i++) {
    const file = flipped ? 7 - i : i;
    const rank = flipped ? i : 7 - i;
    // File labels (bottom)
    labels.push(
      <text
        key={`f${i}`}
        x={i * sqSize + sqSize - 3}
        y={size - 3}
        className={`${styles.label} ${(file + (flipped ? 0 : 0)) % 2 === 0 ? styles.labelLight : styles.labelDark}`}
      >
        {FILES[file]}
      </text>
    );
    // Rank labels (left)
    labels.push(
      <text
        key={`r${i}`}
        x={3}
        y={i * sqSize + 12}
        className={`${styles.label} ${(rank + 0) % 2 === 0 ? styles.labelDark : styles.labelLight}`}
      >
        {RANKS[rank]}
      </text>
    );
  }

  return (
    <div className={styles.boardContainer} style={{ width: size, maxWidth: '100%' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        className={styles.board}
        role="img"
        aria-label="Chess board position"
      >
        {squares}
        {labels}
      </svg>
    </div>
  );
}

export default memo(Chessboard);
