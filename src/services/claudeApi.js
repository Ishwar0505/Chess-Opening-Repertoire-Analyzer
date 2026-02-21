/**
 * Local heuristic-based strategic plan generator.
 * Analyzes engine PV moves to produce a 1-sentence human-readable plan.
 * No API calls needed — runs entirely in the browser.
 */

const FILES = 'abcdefgh';
const KINGSIDE_FILES = new Set(['f', 'g', 'h']);
const QUEENSIDE_FILES = new Set(['a', 'b', 'c']);
const CENTER_FILES = new Set(['d', 'e']);
const CENTER_SQUARES = new Set(['d4', 'd5', 'e4', 'e5', 'c4', 'c5', 'f4', 'f5']);

/**
 * Translate engine PV moves into a human-readable strategic plan.
 * Uses local pattern recognition instead of an LLM.
 *
 * @param {string} fen - FEN position
 * @param {string} pvMoves - Principal variation moves (UCI, space-separated)
 * @param {Object} context - { openingName, evalText }
 * @returns {Promise<string|null>} 1-sentence human plan, or null if insufficient data
 */
export async function translateMoves(fen, pvMoves, context = {}) {
  if (!fen || !pvMoves) return null;

  try {
    const moves = pvMoves.split(/\s+/).slice(0, 8);
    if (moves.length < 2) return null;

    const sideToMove = fen.split(' ')[1] === 'w' ? 'white' : 'black';
    const patterns = detectPatterns(moves, fen, sideToMove);
    const plan = buildPlanSentence(patterns, context, sideToMove);

    return plan;
  } catch {
    return null;
  }
}

/**
 * Parse a UCI move into components.
 */
function parseUci(uci) {
  if (!uci || uci.length < 4) return null;
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    fromFile: uci[0],
    fromRank: uci[1],
    toFile: uci[2],
    toRank: uci[3],
    promotion: uci[4] || null,
  };
}

/**
 * Detect strategic patterns from PV moves.
 */
function detectPatterns(moves, fen, sideToMove) {
  const patterns = {
    castling: null,       // 'kingside' | 'queenside'
    kingsidePawnStorm: false,
    queensidePawnStorm: false,
    centralPawnPush: false,
    pieceManeuver: false,
    fileOpening: false,
    kingAttack: false,
    endgameTechnique: false,
    pawnPromotion: false,
    exchangeSequence: false,
    development: false,
    centralControl: false,
    flankPlay: false,
    prophylaxis: false,
  };

  const playerMoves = moves.filter((_, i) => i % 2 === 0);
  const opponentMoves = moves.filter((_, i) => i % 2 === 1);

  // Count piece activity in each zone
  let kingsideMoves = 0;
  let queensideMoves = 0;
  let centerMoves = 0;
  let pawnMoves = 0;
  let pieceMoves = 0;

  for (const uci of playerMoves) {
    const m = parseUci(uci);
    if (!m) continue;

    // Detect castling
    if (isCastling(uci)) {
      patterns.castling = uci === 'e1g1' || uci === 'e8g8' ? 'kingside' : 'queenside';
      continue;
    }

    // Detect promotion
    if (m.promotion) {
      patterns.pawnPromotion = true;
    }

    // Categorize by target file
    if (KINGSIDE_FILES.has(m.toFile)) kingsideMoves++;
    if (QUEENSIDE_FILES.has(m.toFile)) queensideMoves++;
    if (CENTER_FILES.has(m.toFile)) centerMoves++;

    // Detect pawn vs piece moves (heuristic: pawn moves stay on same file or adjacent)
    if (isPawnLikeMove(m, fen)) {
      pawnMoves++;
      if (KINGSIDE_FILES.has(m.toFile) && parseInt(m.toRank) >= 4) {
        patterns.kingsidePawnStorm = true;
      }
      if (QUEENSIDE_FILES.has(m.toFile) && parseInt(m.toRank) >= 4) {
        patterns.queensidePawnStorm = true;
      }
      if (CENTER_SQUARES.has(m.to)) {
        patterns.centralPawnPush = true;
      }
    } else {
      pieceMoves++;
    }

    if (CENTER_SQUARES.has(m.to)) {
      patterns.centralControl = true;
    }
  }

  // Determine dominant zone
  if (kingsideMoves >= 2 && kingsideMoves > queensideMoves) {
    patterns.kingAttack = true;
  }
  if (queensideMoves >= 2 && queensideMoves > kingsideMoves) {
    patterns.flankPlay = true;
  }
  if (centerMoves >= 2) {
    patterns.centralControl = true;
  }
  if (pieceMoves >= 3) {
    patterns.pieceManeuver = true;
  }
  if (pawnMoves === 0 && pieceMoves >= 2) {
    patterns.development = true;
  }

  // Check if position is likely an endgame (few pieces in FEN)
  const piecesInFen = (fen.split(' ')[0].match(/[rnbqkpRNBQKP]/g) || []).length;
  if (piecesInFen <= 12) {
    patterns.endgameTechnique = true;
  }

  return patterns;
}

function isCastling(uci) {
  return uci === 'e1g1' || uci === 'e1c1' || uci === 'e8g8' || uci === 'e8c8';
}

function isPawnLikeMove(m, fen) {
  // Simple heuristic: moves that advance by 1-2 ranks on same/adjacent file
  const fileDiff = Math.abs(FILES.indexOf(m.toFile) - FILES.indexOf(m.fromFile));
  const rankDiff = Math.abs(parseInt(m.toRank) - parseInt(m.fromRank));
  return fileDiff <= 1 && rankDiff >= 1 && rankDiff <= 2;
}

/**
 * Build a human-readable plan sentence from detected patterns.
 */
function buildPlanSentence(patterns, context, sideToMove) {
  const plans = [];

  if (patterns.pawnPromotion) {
    plans.push('push the passed pawn to promotion');
  }

  if (patterns.castling) {
    plans.push(`castle ${patterns.castling} for king safety`);
  }

  if (patterns.kingsidePawnStorm && !patterns.queensidePawnStorm) {
    plans.push('launch a kingside pawn storm to create attacking chances against the opposing king');
  } else if (patterns.queensidePawnStorm && !patterns.kingsidePawnStorm) {
    plans.push('advance queenside pawns in a minority attack to create structural weaknesses');
  } else if (patterns.kingsidePawnStorm && patterns.queensidePawnStorm) {
    plans.push('expand on both flanks to restrict the opponent\'s counterplay');
  }

  if (patterns.centralPawnPush && !patterns.kingsidePawnStorm && !patterns.queensidePawnStorm) {
    plans.push('seize central space with a pawn advance to restrict the opponent\'s piece activity');
  }

  if (patterns.kingAttack && !patterns.kingsidePawnStorm) {
    plans.push('build a kingside attack by redirecting pieces toward the opposing king');
  }

  if (patterns.pieceManeuver && !patterns.kingAttack && !patterns.kingsidePawnStorm) {
    plans.push('reposition pieces to more active squares to increase coordination');
  }

  if (patterns.centralControl && plans.length === 0) {
    plans.push('fight for central control to maintain a flexible position');
  }

  if (patterns.flankPlay && !patterns.queensidePawnStorm && plans.length === 0) {
    plans.push('generate queenside play to create an initiative on the flank');
  }

  if (patterns.endgameTechnique && plans.length <= 1) {
    if (patterns.pawnPromotion) {
      // Already covered
    } else {
      plans.push('convert the advantage through precise endgame technique');
    }
  }

  if (patterns.development && plans.length === 0) {
    plans.push('complete development and improve piece coordination before committing to a plan');
  }

  // Fallback
  if (plans.length === 0) {
    plans.push('improve the position gradually through careful piece placement and pawn structure management');
  }

  // Build the final sentence
  const evalText = context.evalText || '';
  let prefix = 'The engine suggests';

  if (evalText) {
    const evalNum = parseFloat(evalText.replace('+', ''));
    if (!isNaN(evalNum)) {
      if (Math.abs(evalNum) < 0.3) {
        prefix = 'In this balanced position, the plan is to';
      } else if (evalNum > 1.5) {
        prefix = `With a significant advantage (${evalText}), the plan is to`;
      } else if (evalNum > 0.3) {
        prefix = `With a slight edge (${evalText}), the plan is to`;
      } else if (evalNum < -1.5) {
        prefix = `Facing a difficult position (${evalText}), the priority is to`;
      } else if (evalNum < -0.3) {
        prefix = `Under slight pressure (${evalText}), the idea is to`;
      }
    } else if (evalText.startsWith('M')) {
      prefix = `With a forced checkmate (${evalText}), the plan is to`;
    }
  }

  // Take the most relevant plan (first one is usually most specific)
  const mainPlan = plans[0];
  const sentence = `${prefix} ${mainPlan}.`;

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
