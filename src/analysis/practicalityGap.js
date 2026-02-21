import { getCloudEval } from '../services/cloudEvalApi';
import { queryLichessDB } from '../services/explorerApi';
import { movesToFen, sanMovesToUci } from '../utils/chess';

/**
 * Analyze the gap between engine evaluation and human results for an opening.
 * Identifies "Danger Zones" where engine assessment diverges from practical outcomes.
 *
 * @param {Object} opening - Opening entry: { eco, name, moves, wins, draws, losses, winRate, games }
 * @returns {Promise<Object|null>} Practicality gap analysis result
 */
export async function analyzePracticalityGap(opening) {
  if (!opening?.moves) return null;

  // 1. Get engine evaluation
  const fen = movesToFen(opening.moves);
  if (!fen) return null;

  const cloudEval = await getCloudEval(fen);
  if (!cloudEval) return null;

  // 2. Get human stats from Lichess database (broad sample)
  const uciMoves = sanMovesToUci(opening.moves);
  if (!uciMoves) return null;

  const dbData = await queryLichessDB(uciMoves, {
    ratings: '1600,1800,2000,2200,2500',
    speeds: 'blitz,rapid,classical',
  });

  if (!dbData) return null;

  const total = (dbData.white || 0) + (dbData.draws || 0) + (dbData.black || 0);
  if (total === 0) return null;

  const whiteWinRate = dbData.white / total;
  const blackWinRate = dbData.black / total;
  const evalNum = cloudEval.evalNum;

  // 3. Compute expected win rate from eval using logistic approximation
  const expectedWhiteWinRate = 1 / (1 + Math.pow(10, -evalNum / 4));
  const discrepancyScore = Math.abs(expectedWhiteWinRate - whiteWinRate);

  // 4. Check danger zone conditions
  let isDangerZone = false;
  let dangerType = null;
  let dangerDescription = null;

  // Engine says White is better, but White doesn't win enough
  if (evalNum >= 0.7 && whiteWinRate < 0.45) {
    isDangerZone = true;
    dangerType = 'white-trap';
    dangerDescription =
      `Engine evaluates ${cloudEval.evalText} for White, but White only wins ` +
      `${Math.round(whiteWinRate * 100)}% in practice. This position may be ` +
      `harder to convert than it looks.`;
  }

  // Engine says Black is OK, but Black still struggles
  if (evalNum <= -0.3 && blackWinRate < 0.40) {
    isDangerZone = true;
    dangerType = 'black-resilient';
    dangerDescription =
      `Engine gives Black ${cloudEval.evalText}, but Black only wins ` +
      `${Math.round(blackWinRate * 100)}% in practice. The position may be ` +
      `difficult to play despite the engine's assessment.`;
  }

  return {
    engineEval: evalNum,
    engineEvalText: cloudEval.evalText,
    humanStats: {
      total,
      whiteWins: dbData.white || 0,
      draws: dbData.draws || 0,
      blackWins: dbData.black || 0,
      whiteWinRate,
      blackWinRate,
    },
    discrepancyScore,
    isDangerZone,
    dangerType,
    dangerDescription,
  };
}
