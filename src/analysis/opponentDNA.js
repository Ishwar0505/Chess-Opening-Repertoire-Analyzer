import { streamPlayerGames } from '../services/lichessApi';
import { buildRepertoire } from './repertoire';

/**
 * Scout an opponent by fetching their games and finding repertoire intersections
 * with the current user.
 *
 * @param {string} opponentHandle - Opponent's Lichess username
 * @param {{ white: Array, black: Array }} userRepertoire - User's full repertoire
 * @param {Object} options - { max: number, onProgress: function }
 * @returns {Promise<Object>} Scouting report with critical intersections
 */
export async function scoutOpponent(opponentHandle, userRepertoire, options = {}) {
  const { max = 100, onProgress } = options;

  // 1. Fetch opponent's recent games
  const games = [];
  const gameStream = streamPlayerGames(opponentHandle, { max });
  for await (const game of gameStream) {
    games.push(game);
    if (onProgress) onProgress(games.length);
  }

  if (games.length === 0) {
    return { opponentHandle, totalGames: 0, intersections: [], opponentRepertoire: null };
  }

  // 2. Build opponent repertoire
  const opponentRepertoire = buildRepertoire(games, opponentHandle);

  // 3. Find critical intersections
  const intersections = findIntersections(userRepertoire, opponentRepertoire);

  return {
    opponentHandle,
    totalGames: games.length,
    intersections,
    opponentRepertoire,
  };
}

/**
 * Find openings that appear in both user and opponent repertoires.
 * When user plays White, compare against opponent's Black repertoire (and vice versa).
 * Returns top 3 ranked by relevance.
 */
function findIntersections(userRepertoire, opponentRepertoire) {
  const results = [];

  for (const color of ['white', 'black']) {
    // When user plays White, opponent plays Black
    const opponentColor = color === 'white' ? 'black' : 'white';
    const userOpenings = userRepertoire[color] || [];
    const opponentOpenings = opponentRepertoire[opponentColor] || [];

    // Build lookup by ECO code for fast matching
    const opponentByEco = new Map();
    for (const op of opponentOpenings) {
      if (!opponentByEco.has(op.eco)) {
        opponentByEco.set(op.eco, []);
      }
      opponentByEco.get(op.eco).push(op);
    }

    for (const userOp of userOpenings) {
      const candidates = opponentByEco.get(userOp.eco) || [];

      for (const oppOp of candidates) {
        const overlapType = getOverlapType(userOp, oppOp);
        if (!overlapType) continue;

        results.push({
          eco: userOp.eco,
          name: userOp.name,
          moves: userOp.moves,
          userColor: color,
          userStats: {
            games: userOp.games,
            winRate: userOp.winRate,
            wins: userOp.wins,
            draws: userOp.draws,
            losses: userOp.losses,
          },
          opponentColor,
          opponentStats: {
            games: oppOp.games,
            winRate: oppOp.winRate,
            wins: oppOp.wins,
            draws: oppOp.draws,
            losses: oppOp.losses,
            name: oppOp.name,
          },
          overlap: overlapType,
          // Weight opponent frequency, bonus for user frequency
          relevanceScore: oppOp.games * (1 + userOp.games * 0.1),
        });
      }
    }
  }

  // Sort by relevance and return top 3
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, 3);
}

/**
 * Determine the type of overlap between two openings.
 * Returns 'direct' for exact match, 'transposition' for same ECO with move overlap, null otherwise.
 */
function getOverlapType(userOp, oppOp) {
  // Exact match: same ECO and same name
  if (userOp.eco === oppOp.eco && userOp.name === oppOp.name) {
    return 'direct';
  }

  // Same ECO, check move prefix overlap
  if (userOp.eco === oppOp.eco) {
    const userMoves = (userOp.moves || '').split(/\s+/);
    const oppMoves = (oppOp.moves || '').split(/\s+/);
    const minLen = Math.min(userMoves.length, oppMoves.length, 6);

    let matchCount = 0;
    for (let i = 0; i < minLen; i++) {
      if (userMoves[i] === oppMoves[i]) matchCount++;
    }

    // At least 4 moves matching in the first 6 = transposition
    if (matchCount >= 4) return 'transposition';
  }

  return null;
}
