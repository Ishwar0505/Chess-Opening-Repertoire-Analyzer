/**
 * Build a player's opening repertoire from their games.
 * Groups games by ECO code + opening name, calculates stats per opening.
 */

/**
 * Determine the player's color in a game.
 */
function getPlayerColor(game, username) {
  const lower = username.toLowerCase();
  if (game.players?.white?.user?.id?.toLowerCase() === lower) return 'white';
  if (game.players?.black?.user?.id?.toLowerCase() === lower) return 'black';
  // Fallback: check username field
  if (game.players?.white?.user?.name?.toLowerCase() === lower) return 'white';
  if (game.players?.black?.user?.name?.toLowerCase() === lower) return 'black';
  return null;
}

/**
 * Determine the game result from the player's perspective.
 * Returns 'win', 'draw', or 'loss'.
 */
function getPlayerResult(game, playerColor) {
  if (game.status === 'draw' || game.status === 'stalemate') return 'draw';
  if (!game.winner) return 'draw';
  return game.winner === playerColor ? 'win' : 'loss';
}

/**
 * Build the full repertoire from an array of games.
 *
 * @param {Array} games - Array of game objects from the Lichess API
 * @param {string} username - The player's username
 * @returns {{ white: OpeningEntry[], black: OpeningEntry[] }}
 *
 * Each OpeningEntry:
 *   { eco, name, games, wins, draws, losses, winRate, lastPlayed, avgOpponentRating, moves }
 */
export function buildRepertoire(games, username) {
  const whiteMap = new Map();
  const blackMap = new Map();

  for (const game of games) {
    if (!game.opening) continue;

    const playerColor = getPlayerColor(game, username);
    if (!playerColor) continue;

    const { eco, name, ply } = game.opening;
    const key = `${eco}|${name}`;
    const result = getPlayerResult(game, playerColor);
    const map = playerColor === 'white' ? whiteMap : blackMap;

    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    const opponentRating = game.players?.[opponentColor]?.rating || 0;

    if (!map.has(key)) {
      map.set(key, {
        eco,
        name,
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        winRate: 0,
        lastPlayed: 0,
        totalOpponentRating: 0,
        avgOpponentRating: 0,
        moves: game.moves ? game.moves.split(' ').slice(0, ply || 10).join(' ') : '',
      });
    }

    const entry = map.get(key);
    entry.games++;
    if (result === 'win') entry.wins++;
    else if (result === 'draw') entry.draws++;
    else entry.losses++;

    if (opponentRating) {
      entry.totalOpponentRating += opponentRating;
    }

    const gameTime = game.createdAt || game.lastMoveAt || 0;
    if (gameTime > entry.lastPlayed) {
      entry.lastPlayed = gameTime;
    }
  }

  return {
    white: finalizeEntries(whiteMap),
    black: finalizeEntries(blackMap),
  };
}

/**
 * Convert map entries to sorted array with computed fields.
 */
function finalizeEntries(map) {
  const entries = [];

  for (const entry of map.values()) {
    entry.winRate = entry.games > 0 ? entry.wins / entry.games : 0;
    entry.avgOpponentRating = entry.games > 0
      ? Math.round(entry.totalOpponentRating / entry.games)
      : 0;
    delete entry.totalOpponentRating;
    entries.push(entry);
  }

  // Default sort: most played first
  entries.sort((a, b) => b.games - a.games);
  return entries;
}

/**
 * Sort openings by a given criterion.
 */
export function sortOpenings(openings, sortBy) {
  const sorted = [...openings];

  switch (sortBy) {
    case 'frequency':
      sorted.sort((a, b) => b.games - a.games);
      break;
    case 'winRate':
      sorted.sort((a, b) => b.winRate - a.winRate || b.games - a.games);
      break;
    case 'eco':
      sorted.sort((a, b) => a.eco.localeCompare(b.eco));
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'recent':
      sorted.sort((a, b) => b.lastPlayed - a.lastPlayed);
      break;
    case 'rating':
      sorted.sort((a, b) => b.avgOpponentRating - a.avgOpponentRating);
      break;
    default:
      break;
  }

  return sorted;
}
