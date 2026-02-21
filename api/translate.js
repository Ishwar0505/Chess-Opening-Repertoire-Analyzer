/**
 * Vercel serverless function: Translates engine PV moves into a human-readable plan.
 * Uses Claude API to generate a 1-sentence strategic explanation.
 *
 * POST /api/translate
 * Body: { fen, pvMoves, openingName?, evalText? }
 * Returns: { plan: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { fen, pvMoves, openingName, evalText } = req.body;

  if (!fen || !pvMoves) {
    return res.status(400).json({ error: 'Missing required fields: fen, pvMoves' });
  }

  // Take first 5 moves from PV
  const moves = pvMoves.split(/\s+/).slice(0, 5).join(' ');

  const prompt = buildPrompt(fen, moves, openingName, evalText);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData.error?.message || 'Claude API error',
      });
    }

    const data = await response.json();
    const plan = data.content?.[0]?.text?.trim() || null;

    return res.status(200).json({ plan });
  } catch {
    return res.status(500).json({ error: 'Failed to call Claude API' });
  }
}

function buildPrompt(fen, moves, openingName, evalText) {
  return `You are a chess coach explaining engine analysis to a club player.

Given this chess position (FEN): ${fen}
${openingName ? `Opening: ${openingName}` : ''}
${evalText ? `Engine evaluation: ${evalText}` : ''}

The engine's recommended continuation is: ${moves}

Explain in exactly ONE sentence what the strategic plan is behind these moves. Focus on the human-understandable idea (e.g., "minority attack", "kingside expansion", "piece maneuver to outpost"), not individual move descriptions. Use chess terminology appropriate for an intermediate player.

Respond with only the single sentence, no preamble.`;
}
