/**
 * Minimal chess position tracker for SAN → UCI conversion and PGN parsing.
 * Tracks board state to resolve ambiguous piece moves in algebraic notation.
 */

const FILES = 'abcdefgh';
const RANKS = '12345678';

function sq(file, rank) {
  return FILES[file] + RANKS[rank];
}

function fileIdx(c) {
  return c.charCodeAt(0) - 97;
}

function rankIdx(c) {
  return c.charCodeAt(0) - 49;
}

function parseSquare(s) {
  return [fileIdx(s[0]), rankIdx(s[1])];
}

function createInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = back[c];
    board[1][c] = 'P';
    board[6][c] = 'p';
    board[7][c] = back[c].toLowerCase();
  }
  return board;
}

/**
 * Create a fresh starting position.
 */
export function createPosition() {
  return {
    board: createInitialBoard(),
    turn: 'w',
    castling: { K: true, Q: true, k: true, q: true },
    epSquare: null,
  };
}

function pieceAt(pos, file, rank) {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return pos.board[rank][file];
}

function isWhite(p) {
  return p !== null && p === p.toUpperCase();
}

function isOwn(p, turn) {
  return p !== null && (turn === 'w' ? isWhite(p) : !isWhite(p));
}

function pieceType(p) {
  return p ? p.toUpperCase() : null;
}

function findPieces(pos, type) {
  const result = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = pos.board[r][c];
      if (p && pieceType(p) === type && isOwn(p, pos.turn)) {
        result.push([c, r]);
      }
    }
  }
  return result;
}

function pathClear(pos, f1, r1, f2, r2) {
  const sf = Math.sign(f2 - f1);
  const sr = Math.sign(r2 - r1);
  let f = f1 + sf, r = r1 + sr;
  while (f !== f2 || r !== r2) {
    if (pieceAt(pos, f, r)) return false;
    f += sf;
    r += sr;
  }
  return true;
}

function canReach(pos, piece, ff, fr, tf, tr, capture) {
  const type = pieceType(piece);
  const df = tf - ff, dr = tr - fr;

  switch (type) {
    case 'P': {
      const dir = isWhite(piece) ? 1 : -1;
      const startRank = isWhite(piece) ? 1 : 6;
      if (capture) {
        return Math.abs(df) === 1 && dr === dir;
      }
      if (df === 0 && dr === dir && !pieceAt(pos, tf, tr)) return true;
      if (df === 0 && dr === 2 * dir && fr === startRank
        && !pieceAt(pos, tf, fr + dir) && !pieceAt(pos, tf, tr)) return true;
      return false;
    }
    case 'N':
      return (Math.abs(df) === 1 && Math.abs(dr) === 2)
        || (Math.abs(df) === 2 && Math.abs(dr) === 1);
    case 'B':
      return Math.abs(df) === Math.abs(dr) && df !== 0
        && pathClear(pos, ff, fr, tf, tr);
    case 'R':
      return (df === 0 || dr === 0) && (df !== 0 || dr !== 0)
        && pathClear(pos, ff, fr, tf, tr);
    case 'Q':
      return ((df === 0 || dr === 0) || Math.abs(df) === Math.abs(dr))
        && (df !== 0 || dr !== 0) && pathClear(pos, ff, fr, tf, tr);
    case 'K':
      return Math.abs(df) <= 1 && Math.abs(dr) <= 1 && (df !== 0 || dr !== 0);
    default:
      return false;
  }
}

function parseSAN(san) {
  let s = san.replace(/[+#!?]+$/g, '');

  if (s === 'O-O' || s === '0-0') return { castling: 'K' };
  if (s === 'O-O-O' || s === '0-0-0') return { castling: 'Q' };

  let promotion = null;
  const pm = s.match(/=([QRBN])/i);
  if (pm) {
    promotion = pm[1].toLowerCase();
    s = s.replace(/=[QRBN]/i, '');
  }

  const capture = s.includes('x');
  s = s.replace('x', '');

  const dest = s.slice(-2);
  s = s.slice(0, -2);

  let piece = 'P';
  if (s.length > 0 && 'NBRQK'.includes(s[0])) {
    piece = s[0];
    s = s.slice(1);
  }

  let dFile = null, dRank = null;
  for (const ch of s) {
    if (ch >= 'a' && ch <= 'h') dFile = fileIdx(ch);
    else if (ch >= '1' && ch <= '8') dRank = rankIdx(ch);
  }

  return { piece, dest, capture, promotion, dFile, dRank };
}

/**
 * Convert a SAN move to UCI format given the current position.
 * Does NOT mutate the position.
 */
export function sanToUci(pos, san) {
  const p = parseSAN(san);

  if (p.castling) {
    const rank = pos.turn === 'w' ? 0 : 7;
    return p.castling === 'K'
      ? sq(4, rank) + sq(6, rank)
      : sq(4, rank) + sq(2, rank);
  }

  const [tf, tr] = parseSquare(p.dest);
  const candidates = findPieces(pos, p.piece);

  for (const [cf, cr] of candidates) {
    if (p.dFile !== null && cf !== p.dFile) continue;
    if (p.dRank !== null && cr !== p.dRank) continue;
    if (canReach(pos, pieceAt(pos, cf, cr), cf, cr, tf, tr, p.capture)) {
      let uci = sq(cf, cr) + p.dest;
      if (p.promotion) uci += p.promotion;
      return uci;
    }
  }

  return null;
}

/**
 * Apply a SAN move to the position (mutates pos).
 * Returns the UCI string, or null if the move couldn't be resolved.
 */
export function applyMove(pos, san) {
  const uci = sanToUci(pos, san);
  if (!uci) return null;

  const p = parseSAN(san);

  if (p.castling) {
    const r = pos.turn === 'w' ? 0 : 7;
    if (p.castling === 'K') {
      pos.board[r][6] = pos.board[r][4];
      pos.board[r][5] = pos.board[r][7];
      pos.board[r][4] = null;
      pos.board[r][7] = null;
    } else {
      pos.board[r][2] = pos.board[r][4];
      pos.board[r][3] = pos.board[r][0];
      pos.board[r][4] = null;
      pos.board[r][0] = null;
    }
    if (pos.turn === 'w') { pos.castling.K = false; pos.castling.Q = false; }
    else { pos.castling.k = false; pos.castling.q = false; }
    pos.epSquare = null;
    pos.turn = pos.turn === 'w' ? 'b' : 'w';
    return uci;
  }

  const [ff, fr] = parseSquare(uci.slice(0, 2));
  const [tf, tr] = parseSquare(uci.slice(2, 4));
  const piece = pos.board[fr][ff];

  // En passant capture
  if (pieceType(piece) === 'P' && p.capture && !pos.board[tr][tf]) {
    pos.board[fr][tf] = null;
  }

  // Move piece (with promotion if applicable)
  pos.board[tr][tf] = p.promotion
    ? (pos.turn === 'w' ? p.promotion.toUpperCase() : p.promotion.toLowerCase())
    : piece;
  pos.board[fr][ff] = null;

  // En passant target square
  pos.epSquare = (pieceType(piece) === 'P' && Math.abs(tr - fr) === 2)
    ? [ff, (fr + tr) / 2]
    : null;

  // Update castling rights
  if (piece === 'K') { pos.castling.K = false; pos.castling.Q = false; }
  if (piece === 'k') { pos.castling.k = false; pos.castling.q = false; }
  // Rook moved from starting square
  if (ff === 0 && fr === 0) pos.castling.Q = false;
  if (ff === 7 && fr === 0) pos.castling.K = false;
  if (ff === 0 && fr === 7) pos.castling.q = false;
  if (ff === 7 && fr === 7) pos.castling.k = false;
  // Rook captured on starting square
  if (tf === 0 && tr === 0) pos.castling.Q = false;
  if (tf === 7 && tr === 0) pos.castling.K = false;
  if (tf === 0 && tr === 7) pos.castling.q = false;
  if (tf === 7 && tr === 7) pos.castling.k = false;

  pos.turn = pos.turn === 'w' ? 'b' : 'w';
  return uci;
}

/**
 * Convert a space-separated SAN move string to comma-separated UCI.
 * e.g., "e4 e5 Nf3 Nc6" → "e2e4,e7e5,g1f3,b8c6"
 */
export function sanMovesToUci(sanMoves) {
  const pos = createPosition();
  const sans = typeof sanMoves === 'string'
    ? sanMoves.split(/\s+/).filter(Boolean)
    : sanMoves;
  const uciMoves = [];

  for (const san of sans) {
    const uci = applyMove(pos, san);
    if (!uci) break;
    uciMoves.push(uci);
  }

  return uciMoves.join(',');
}

/**
 * Convert a position to a FEN string.
 */
export function positionToFen(pos, ply = 0) {
  let fen = '';

  for (let r = 7; r >= 0; r--) {
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      const p = pos.board[r][c];
      if (p) {
        if (empty > 0) { fen += empty; empty = 0; }
        fen += p;
      } else {
        empty++;
      }
    }
    if (empty > 0) fen += empty;
    if (r > 0) fen += '/';
  }

  fen += ' ' + pos.turn;

  let castling = '';
  if (pos.castling.K) castling += 'K';
  if (pos.castling.Q) castling += 'Q';
  if (pos.castling.k) castling += 'k';
  if (pos.castling.q) castling += 'q';
  fen += ' ' + (castling || '-');

  fen += ' ' + (pos.epSquare ? sq(pos.epSquare[0], pos.epSquare[1]) : '-');
  fen += ' 0 ' + (Math.floor(ply / 2) + 1);

  return fen;
}

/**
 * Apply a series of SAN moves and return the resulting FEN.
 */
export function movesToFen(sanMoves) {
  const pos = createPosition();
  const sans = typeof sanMoves === 'string'
    ? sanMoves.split(/\s+/).filter(Boolean)
    : sanMoves;

  let ply = 0;
  for (const san of sans) {
    if (!applyMove(pos, san)) break;
    ply++;
  }

  return positionToFen(pos, ply);
}

/**
 * Parse PGN text into an object with headers and moves array.
 */
export function parsePGN(pgn) {
  const headers = {};
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  while ((match = headerRegex.exec(pgn))) {
    headers[match[1]] = match[2];
  }

  let moveText = pgn.replace(/\[.*?\]\s*/g, '').trim();
  moveText = moveText.replace(/\{[^}]*\}/g, '');       // Remove comments
  moveText = moveText.replace(/\([^)]*\)/g, '');        // Remove variations
  moveText = moveText.replace(/\d+\.{3}\s*/g, '');      // Remove continuation dots
  moveText = moveText.replace(/\d+\.\s*/g, '');         // Remove move numbers
  moveText = moveText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');

  const moves = moveText.split(/\s+/).filter(Boolean);
  return { headers, moves };
}
