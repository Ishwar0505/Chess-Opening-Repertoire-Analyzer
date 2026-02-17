/**
 * Opening themes database mapping ECO code ranges to strategic insights.
 * Covers A00–E99 with middlegame ideas, attacking strategies, and tactical motifs.
 *
 * Each entry defines a range [startEco, endEco] inclusive.
 */

const THEMES = [
  // ── A: Flank & Irregular ──────────────────────────────────────────
  {
    eco: ['A00', 'A09'],
    family: 'Flank Openings',
    structures: ['Reversed Sicilian', 'Fianchetto structures'],
    middlegame: {
      white: [
        'Control the center indirectly with pieces and fianchetto',
        'Transpose into favorable lines the opponent may not know well',
        'Use flexible pawn structure to adapt to Black\'s setup',
      ],
      black: [
        'Occupy the center with pawns while White develops on the flank',
        'Develop actively and challenge White\'s indirect approach',
        'Equalize by seizing central space with ...d5 or ...e5',
      ],
    },
    attacking: [
      'Kingside fianchetto followed by central pawn break',
      'Exploit overextension if opponent grabs too much space',
    ],
    tactics: [
      'Transposition tricks into known positions',
      'Central pawn forks after delayed development',
    ],
  },
  {
    eco: ['A10', 'A39'],
    family: 'English Opening',
    structures: ['Reversed Sicilian', 'Symmetrical English', 'Botvinnik structure'],
    middlegame: {
      white: [
        'Control d5 with c4 and Nc3, delay d4 for flexibility',
        'Fianchetto on g2 for long diagonal pressure',
        'Play for a Maroczy Bind with c4+e4 if Black allows it',
        'Aim for the d5 outpost for a knight',
      ],
      black: [
        'Counter with ...d5 break to challenge White\'s center',
        'Adopt symmetrical setup with ...c5 and fight for d4',
        'Play ...e5 to reach reversed Open Sicilian positions',
      ],
    },
    attacking: [
      'Queenside expansion with b4-b5',
      'Kingside attack via f4-f5 in Botvinnik setups',
      'Central break with d4 when well-prepared',
    ],
    tactics: [
      'Pin on the long diagonal (g2 bishop)',
      'Knight jumps to d5 or b5',
      'Discovered attacks after pawn exchanges in the center',
    ],
  },
  {
    eco: ['A40', 'A44'],
    family: 'Queen\'s Pawn Miscellaneous',
    structures: ['Old Benoni', 'Modern Defense', 'Irregular QP'],
    middlegame: {
      white: [
        'Maintain central space advantage with d4+e4',
        'Restrict Black\'s counterplay on the queenside',
        'Develop pieces to active squares before pushing further',
      ],
      black: [
        'Undermine White\'s center with ...c5, ...e5, or ...f5 breaks',
        'Use hypermodern approach: control center with pieces, not pawns',
        'Aim for ...d5 break when White overextends',
      ],
    },
    attacking: [
      'Central pawn steamroller if Black is passive',
      'Piece activity advantage from superior development',
    ],
    tactics: [
      'Central pawn captures opening lines for pieces',
      'Tactical shots based on Black\'s cramped position',
    ],
  },
  {
    eco: ['A45', 'A49'],
    family: 'London System / Trompowsky',
    structures: ['London pawn triangle', 'Stonewall formation'],
    middlegame: {
      white: [
        'Build the London pyramid: d4, e3, Bf4, Nf3, Bd3',
        'Keep a solid, hard-to-break structure',
        'Launch a kingside attack with Ne5, Qf3, and h4-h5',
        'Trade dark-squared bishops to weaken Black\'s kingside',
      ],
      black: [
        'Challenge with ...c5 to break White\'s center',
        'Play ...Qb6 to pressure b2 and d4 simultaneously',
        'Develop the light-squared bishop outside the pawn chain before ...e6',
        'Target the slightly passive white setup with active piece play',
      ],
    },
    attacking: [
      'Greek Gift sacrifice (Bxh7+) after Ne5 and Qh5',
      'Kingside pawn storm with h4-h5 in closed positions',
      'Central break with e4 when ready',
    ],
    tactics: [
      'Pin on the h2-b8 diagonal for the Bf4',
      'Discovered attacks after Ne5 moves',
      'Knight fork motifs on c7 or e7',
    ],
  },
  {
    eco: ['A50', 'A55'],
    family: 'Old Indian / Budapest',
    structures: ['Old Indian wall', 'Budapest Gambit'],
    middlegame: {
      white: [
        'Maintain space advantage and restrict Black\'s pieces',
        'Advance e4-e5 to cramp Black further',
        'Open the position favorably when ready for a breakthrough',
      ],
      black: [
        'In Budapest: use active piece play to compensate for the pawn',
        'In Old Indian: prepare ...e5 or ...f5 pawn breaks',
        'Avoid passive positions — seek active counterplay early',
      ],
    },
    attacking: [
      'Kingside attack with f4-f5 if Black is passive',
      'Budapest: piece activity and tactical tricks around e4/d4',
    ],
    tactics: [
      'Knight fork motifs on c2/e2 in Budapest',
      'Central pawn breaks creating tactical complications',
    ],
  },
  {
    eco: ['A56', 'A79'],
    family: 'Benoni / Benko Gambit',
    structures: ['Modern Benoni', 'Benko Gambit', 'Czech Benoni'],
    middlegame: {
      white: [
        'Maintain the d5 pawn wedge to restrict Black\'s pieces',
        'Attack on the kingside with f4-f5 or e4-e5 breaks',
        'Use the extra space for piece maneuvering',
        'In Benko: hold the extra pawn and neutralize queenside pressure',
      ],
      black: [
        'Counter on the queenside with ...a6, ...b5, and ...Rb8',
        'Play ...f5 to challenge White\'s center and activate pieces',
        'Use the e5 square as a knight outpost',
        'In Benko: pressure a2/b2 with rooks and bishops on the long diagonal',
      ],
    },
    attacking: [
      'White: f4-f5 pawn storm against Black\'s king',
      'Black: queenside pawn storm and pressure on semi-open files',
      'Piece sacrifice on e6 to shatter Black\'s structure',
    ],
    tactics: [
      'Tactical shots on the a1-h8 diagonal in Benko',
      'Deflection sacrifices on f5 or e6',
      'Back rank issues after piece exchanges',
    ],
  },
  {
    eco: ['A80', 'A99'],
    family: 'Dutch Defense',
    structures: ['Stonewall Dutch', 'Leningrad Dutch', 'Classical Dutch'],
    middlegame: {
      white: [
        'Exploit the weak e5 square and the light-square holes',
        'Exchange Black\'s dark-squared bishop to weaken the king',
        'Play c4-c5 for queenside space and piece activity',
      ],
      black: [
        'Stonewall: use the e4 outpost for the knight, attack on the kingside',
        'Leningrad: fianchetto on g7, play ...e5 for central control',
        'Launch a kingside attack with ...f4, ...g5-g4',
        'Keep the center closed to support the king attack',
      ],
    },
    attacking: [
      'Black: kingside pawn storm with ...f4, ...g5, ...Rf6-h6',
      'White: exploit weaknesses on e5 and the light squares',
      'Stonewall: Greek Gift ideas after ...Bd6 and ...Qh5',
    ],
    tactics: [
      'Knight outpost on e4 (Black) or e5 (White)',
      'Pins on the long diagonal against the king',
      'Sacrifice on h3/h6 to open the king position',
    ],
  },

  // ── B: Semi-Open Games ────────────────────────────────────────────
  {
    eco: ['B00', 'B00'],
    family: 'Uncommon e4 Responses',
    structures: ['Irregular', 'Owen Defense', 'Nimzovich Defense'],
    middlegame: {
      white: [
        'Seize the center with d4 and develop naturally',
        'Punish irregular play by occupying key central squares',
      ],
      black: [
        'Aim to transpose into known structures when possible',
        'Prepare ...d5 or ...e5 breaks to challenge the center',
      ],
    },
    attacking: ['Central domination leading to piece activity advantage'],
    tactics: ['Tactics based on Black\'s awkward piece placement'],
  },
  {
    eco: ['B01', 'B01'],
    family: 'Scandinavian Defense',
    structures: ['Scandinavian with ...Qa5', 'Scandinavian with ...Qd6'],
    middlegame: {
      white: [
        'Develop rapidly while Black\'s queen is exposed',
        'Play Nc3, Bd2, and O-O-O for aggressive setups',
        'Use the tempo advantage from early queen moves',
      ],
      black: [
        'Place the queen on a5 or d6 to avoid further tempo loss',
        'Develop solidly with ...Nf6, ...Bf5, ...e6, ...c6',
        'Aim for a solid Caro-Kann-like structure',
      ],
    },
    attacking: [
      'White: rapid development and central control for early initiative',
      'Attack the exposed queen with Nc3-d5 ideas',
    ],
    tactics: [
      'Queen traps if Black\'s queen is misplaced',
      'Tactical shots exploiting the development lead',
    ],
  },
  {
    eco: ['B02', 'B05'],
    family: 'Alekhine\'s Defense',
    structures: ['Four Pawns Attack', 'Exchange Variation', 'Modern Variation'],
    middlegame: {
      white: [
        'Maintain the pawn center and use the space advantage',
        'In Four Pawns Attack: support the center and attack',
        'Avoid overextension — keep pawns defended',
      ],
      black: [
        'Provoke pawn advances then undermine them with ...d6, ...c5',
        'Attack the overextended center from the flanks',
        'Use piece activity to compensate for less space',
      ],
    },
    attacking: [
      'White: space advantage for piece maneuvering and kingside attack',
      'Black: counterattack against the overextended center',
    ],
    tactics: [
      'Pawn undermining tactics (...c5, ...f6)',
      'Knight maneuvers to attack weak pawns',
    ],
  },
  {
    eco: ['B06', 'B09'],
    family: 'Pirc / Modern Defense',
    structures: ['Pirc Classical', 'Austrian Attack', 'Modern/Robatsch'],
    middlegame: {
      white: [
        'Build a strong center with d4+e4 and attack the kingside',
        'Austrian Attack: play f4-f5 for a direct assault',
        'Develop pieces aggressively and launch a central or kingside attack',
      ],
      black: [
        'Fianchetto on g7 and pressure the d4 pawn from distance',
        'Prepare ...c5 or ...e5 counterstrikes against the center',
        'Use the flexible setup to transpose to favorable structures',
      ],
    },
    attacking: [
      'White: f4-f5 pawn storm in Austrian Attack',
      'Black: ...e5 break and counterplay on the dark squares',
      'Piece sacrifice on f7 or e6 when center is open',
    ],
    tactics: [
      'Tactical shots on the long diagonal (g7 bishop)',
      'Pawn forks in the center after exchanges',
      'Knight outpost on d4 or e5',
    ],
  },
  {
    eco: ['B10', 'B19'],
    family: 'Caro-Kann Defense',
    structures: ['Advance Variation', 'Classical/Main Line', 'Exchange Variation', 'Panov-Botvinnik'],
    middlegame: {
      white: [
        'Advance: maintain e5 pawn chain, attack on the kingside',
        'Classical: develop the knight to an active square and seize space',
        'Panov: play with IQP — use piece activity for an attack',
        'Restrict Black\'s light-squared bishop (the key Caro-Kann piece)',
      ],
      black: [
        'Develop the light-squared bishop outside the pawn chain (...Bf5 or ...Bg4)',
        'Play ...c5 to challenge the d4 pawn',
        'Aim for solid structure with ...e6, ...Nd7, ...Ngf6',
        'In Advance: undermine with ...c5 and ...f6',
      ],
    },
    attacking: [
      'White: kingside attack when Black castles short in Advance Var.',
      'Panov: IQP-based attacks with pieces flooding the kingside',
      'Black: queenside counterplay with ...b5 or ...Qa5',
    ],
    tactics: [
      'Pin along the d-file after IQP positions',
      'Tactical breaks with ...e5 or ...c5 undermining the center',
      'Back rank motifs in endgames',
      'Knight outpost on d5',
    ],
  },
  {
    eco: ['B20', 'B29'],
    family: 'Sicilian (Anti-Sicilian)',
    structures: ['Closed Sicilian', 'Alapin', 'Grand Prix Attack', 'Smith-Morra Gambit'],
    middlegame: {
      white: [
        'Closed: fianchetto on g2, play f4-f5 for kingside attack',
        'Alapin (c3): build a strong d4 center',
        'Grand Prix: f4 system with Be2, O-O, and direct kingside play',
        'Smith-Morra: use lead in development for tactical play',
      ],
      black: [
        'Against Closed: expand on the queenside with ...a6, ...b5, ...Rb8',
        'Against Alapin: challenge with ...d5 immediately',
        'Against Grand Prix: play ...d5 to take over the center',
      ],
    },
    attacking: [
      'Closed Sicilian: f4-f5-fxg6 kingside storm',
      'Smith-Morra: rapid piece development for tactical shots on c and d files',
    ],
    tactics: [
      'Tactical shots on half-open c-file',
      'Knight jumps to d5 in favorable positions',
    ],
  },
  {
    eco: ['B30', 'B39'],
    family: 'Sicilian (Sveshnikov / Rossolimo)',
    structures: ['Sveshnikov with ...d5 hole', 'Rossolimo (Bb5)', 'Kalashnikov'],
    middlegame: {
      white: [
        'Sveshnikov: exploit the d5 outpost for a knight or bishop',
        'Target the backward d6 pawn',
        'Rossolimo: double Black\'s pawns with Bxc6 and play against the structure',
      ],
      black: [
        'Sveshnikov: accept the d5 weakness for dynamic piece play',
        'Use the bishop pair and ...f5 for active counterplay',
        'Counter on the queenside with ...a5-a4 and pressure on b-file',
      ],
    },
    attacking: [
      'White: exploit d5 and kingside pressure after Nd5',
      'Black: ...f5 pawn break for central and kingside counterplay',
    ],
    tactics: [
      'Nd5 sacrificial ideas forking key squares',
      'Tactical shots along the a1-h8 diagonal',
      'Pin motifs on the d-file',
    ],
  },
  {
    eco: ['B40', 'B49'],
    family: 'Sicilian (Kan / Taimanov / Paulsen)',
    structures: ['Kan/Paulsen', 'Taimanov', 'Hedgehog'],
    middlegame: {
      white: [
        'Play e4-e5 to gain space when possible',
        'Prevent ...d5 break and maintain pressure',
        'Launch a kingside attack with Be3, Qd2, f4',
      ],
      black: [
        'Adopt Hedgehog setup: pawns on a6, b6, d6, e6 with pieces behind',
        'Wait for White to overextend then strike with ...d5 or ...b5',
        'Flexible piece placement allows adaptation to White\'s plans',
      ],
    },
    attacking: [
      'White: English Attack with Be3, f3, Qd2, g4',
      'Black: sudden ...d5 or ...b5 pawn breaks for counterattack',
    ],
    tactics: [
      'Tactics exploiting the half-open c-file',
      'Knight fork motifs on d4 and f4',
      'Sacrifice on e6 to shatter the Hedgehog',
    ],
  },
  {
    eco: ['B50', 'B69'],
    family: 'Sicilian (Richter-Rauzer / Open)',
    structures: ['Open Sicilian', 'Richter-Rauzer'],
    middlegame: {
      white: [
        'Develop the dark-squared bishop to g5 to pin the f6 knight',
        'Combine queenside castling with kingside pawn storm',
        'Control d5 and restrict Black\'s counterplay',
      ],
      black: [
        'Counter with ...a6, ...b5 queenside expansion',
        'Play ...h6 to challenge the Bg5 pin',
        'Use the half-open c-file for rook activity',
      ],
    },
    attacking: [
      'White: opposite-side castling with g4-g5-h4-h5 storm',
      'Black: ...b5-b4 queenside pawn storm with rooks on c-file',
    ],
    tactics: [
      'Pin on the f6 knight (Bg5)',
      'Exchange sacrifice on c3 to shatter White\'s structure',
      'Back rank threats in the middlegame',
    ],
  },
  {
    eco: ['B70', 'B79'],
    family: 'Sicilian Dragon',
    structures: ['Dragon', 'Accelerated Dragon', 'Yugoslav Attack'],
    middlegame: {
      white: [
        'Yugoslav Attack: Be3, Qd2, O-O-O, then h4-h5 pawn storm',
        'Exchange the dragon bishop (Bxg7) to weaken the king',
        'Push h4-h5-hxg6 to open lines against Black\'s king',
      ],
      black: [
        'Fianchetto bishop on g7 is the key piece — keep it alive',
        'Counter on the queenside with ...a5, ...Qa5, ...Rc8',
        'Aim for ...d5 central break when White overcommits on the kingside',
        'Exchange sacrifice on c3 is a common defensive/attacking resource',
      ],
    },
    attacking: [
      'White: h-file attack after h4-h5-hxg6',
      'Black: queenside counterattack — race to deliver mate first',
      'Sacrifice on c3 (Rxc3/Bxc3) to destroy White\'s pawn shield',
    ],
    tactics: [
      'Exchange sacrifice on c3 (thematic for Black)',
      'Bxh6 sacrifice to open the g-file',
      'Back rank mates in sharp tactical lines',
      'Discovered attacks along the long diagonal',
    ],
  },
  {
    eco: ['B80', 'B89'],
    family: 'Sicilian Scheveningen',
    structures: ['Scheveningen small center', 'Keres Attack', 'English Attack'],
    middlegame: {
      white: [
        'Keres Attack: play g4 early to prevent ...e5 and attack',
        'English Attack: Be3, f3, Qd2, g4 for a kingside assault',
        'Maintain central tension and look for e5 or f5 breaks',
      ],
      black: [
        'Develop solidly with ...a6, ...Be7, ...O-O, ...b5',
        'Prepare ...d5 or ...e5 central breaks when the time is right',
        'Queenside counterplay with ...b5-b4 and activity on the c-file',
      ],
    },
    attacking: [
      'White: g4-g5 kingside storm in Keres Attack',
      'Black: ...d5 central break undermining White\'s center',
    ],
    tactics: [
      'Piece sacrifices on e6 or d5 to open the position',
      'Tactical motifs around the weakened d5 square',
      'Pin and discovered attack themes after g4-g5',
    ],
  },
  {
    eco: ['B90', 'B99'],
    family: 'Sicilian Najdorf',
    structures: ['Najdorf', 'English Attack in Najdorf', 'Poisoned Pawn'],
    middlegame: {
      white: [
        'English Attack: Be3, f3, Qd2, g4, O-O-O for a systematic assault',
        'Classical with Be2: restrained approach aiming for f4',
        'Bg5 lines: pressure the f6 knight and aim for e5',
      ],
      black: [
        'Play ...e5 to challenge the center (most common)',
        'Or ...e6 for Scheveningen-type positions',
        'Queenside counterplay with ...b5 is essential',
        'In Poisoned Pawn: grab b2 and defend accurately',
      ],
    },
    attacking: [
      'White: English Attack kingside storm with g4-g5',
      'Black: queenside counterattack with ...b5, ...b4, ...Rc8',
      'Both sides: mutual attacks in opposite-side castling positions',
    ],
    tactics: [
      'Sacrifice on e6 to expose the king',
      'Exchange sacrifice on c3 (thematic for Black)',
      'Knight jumps to d5 creating multiple threats',
      'Poisoned Pawn variations: precise tactical defense',
    ],
  },

  // ── C: Open Games ─────────────────────────────────────────────────
  {
    eco: ['C00', 'C19'],
    family: 'French Defense',
    structures: ['Advance chain', 'Exchange French', 'Winawer', 'Classical French', 'Tarrasch'],
    middlegame: {
      white: [
        'Advance: maintain the e5 chain, play f4 to support it',
        'Attack on the kingside with Qg4, Nf3-g5, or h4-h5',
        'Control space and restrict Black\'s light-squared bishop',
        'Winawer: accept doubled pawns for active piece play',
      ],
      black: [
        'Undermine White\'s center with ...c5 (primary break)',
        'Prepare ...f6 to challenge e5 (secondary break)',
        'Activate the light-squared bishop (the "French bishop problem")',
        'Play on the queenside with ...a5, ...b6, ...Ba6',
      ],
    },
    attacking: [
      'White: kingside attack with Qg4 targeting g7 after ...O-O',
      'Black: queenside operations with ...c5, ...Nc6-a5-c4',
      'White: Bxh6 sacrifice ideas in Advance Variation',
    ],
    tactics: [
      'Pawn break tactics (...c5, ...f6) undermining the chain',
      'Pin on the d-file after exchanges',
      'Sacrifice on f7 or h7 when Black\'s king is exposed',
      'Knight outpost on d4 (White) or d5 (either side)',
    ],
  },
  {
    eco: ['C20', 'C29'],
    family: 'Open Game (Various) / Vienna',
    structures: ['King\'s Pawn bilateral', 'Vienna Game', 'Center Game'],
    middlegame: {
      white: [
        'Develop quickly and fight for central control',
        'Vienna: play f4 for a delayed King\'s Gambit approach',
        'Use open lines for piece activity',
      ],
      black: [
        'Mirror active development and contest the center',
        'Exploit any premature attacks by White',
      ],
    },
    attacking: [
      'Open e-file attacks against the uncastled king',
      'f4 advance for kingside aggression in Vienna',
    ],
    tactics: [
      'Central pawn forks and discovered attacks',
      'Pins along the e-file',
    ],
  },
  {
    eco: ['C30', 'C39'],
    family: 'King\'s Gambit',
    structures: ['King\'s Gambit Accepted', 'King\'s Gambit Declined'],
    middlegame: {
      white: [
        'Use the open f-file for attacking the black king',
        'Rapid development to exploit the lead in tempo',
        'Play d4 to open the center while Black is disorganized',
        'Sacrifice material for a devastating attack',
      ],
      black: [
        'Hold the extra pawn and develop solidly if accepting',
        'Return the pawn at the right moment for counterplay',
        'If declining: maintain a solid center and exploit White\'s weakened kingside',
      ],
    },
    attacking: [
      'White: direct kingside assault on the open f-file',
      'Piece sacrifices for rapid development and attack',
      'Bc4+Qh5 battery ideas targeting f7',
    ],
    tactics: [
      'Discovered checks along the e-file',
      'Sacrifice on f7 to expose the king',
      'Back rank threats after rapid piece development',
      'Smothered mate motifs with knights',
    ],
  },
  {
    eco: ['C40', 'C41'],
    family: 'Philidor / Latvian Gambit',
    structures: ['Philidor pawn structure', 'Hanham Variation'],
    middlegame: {
      white: [
        'Exploit Black\'s cramped position with piece pressure',
        'Play for d4-d5 break when pieces are well placed',
        'Control the center and prevent ...d5 and ...f5 breaks',
      ],
      black: [
        'Prepare ...d5 or ...f5 breaks to free the position',
        'Use the solid but passive setup to hold and counterattack later',
      ],
    },
    attacking: ['Central break d4-d5 opening lines for White\'s pieces'],
    tactics: ['Pins on the d-file', 'Tactical tricks if Black is too passive'],
  },
  {
    eco: ['C42', 'C43'],
    family: 'Petrov\'s Defense',
    structures: ['Symmetrical Petrov', 'Stafford Gambit'],
    middlegame: {
      white: [
        'Gain a slight edge through precise move order',
        'Maintain central control and target potential weaknesses',
        'Play for a slight space advantage with d4',
      ],
      black: [
        'Equalize through symmetry and solid play',
        'Avoid falling into opening traps (the critical first 10 moves)',
        'Play for endgame equality with confident defense',
      ],
    },
    attacking: ['White: maintain pressure and avoid early simplification'],
    tactics: ['Opening traps around the Nxe5 and d4 lines', 'Stafford Gambit tricks'],
  },
  {
    eco: ['C44', 'C49'],
    family: 'Scotch / Four Knights',
    structures: ['Scotch Open Center', 'Four Knights Symmetrical'],
    middlegame: {
      white: [
        'Scotch: use the open center for active piece play',
        'Place the queen actively (Qe3 or Qf3) to control key squares',
        'Four Knights: play for a positional edge with d4',
      ],
      black: [
        'Scotch: develop quickly and challenge White\'s central outpost',
        'Four Knights: maintain symmetry and aim for equality',
        'Counter in the center with ...d5 when possible',
      ],
    },
    attacking: [
      'Scotch: active piece play in the open center',
      'Piece pressure on f7 and d5 squares',
    ],
    tactics: [
      'Central pawn breaks creating tactical shots',
      'Pin motifs in the Four Knights with Bb5',
    ],
  },
  {
    eco: ['C50', 'C59'],
    family: 'Italian Game / Two Knights',
    structures: ['Giuoco Piano', 'Evans Gambit', 'Two Knights Defense', 'Italian with d3'],
    middlegame: {
      white: [
        'Italian (d3): slow buildup with a4, Re1, Nbd2-f1-g3',
        'Evans Gambit: rapid development for a kingside attack',
        'Control d4 and aim for d4-d5 central advance',
        'Place pieces on ideal squares before committing to pawn breaks',
      ],
      black: [
        'Challenge the Italian bishop with ...Na5 or ...a6',
        'Prepare ...d5 break to free the position',
        'In Two Knights: play actively with ...Na5 pressuring c4',
        'Against Evans Gambit: return material for a solid position',
      ],
    },
    attacking: [
      'Evans Gambit: rapid development and central control for attack',
      'Italian: slow kingside buildup with Nf1-g3, Bg5/Be3, Qd2',
      'f4-f5 break to open lines in the Giuoco Piano',
    ],
    tactics: [
      'Fried Liver Attack (Nxf7) in Two Knights',
      'Sacrifice on f7 or d5 for rapid attack',
      'Pin along the a2-g8 diagonal (Bc4 targeting f7)',
      'Knight fork motifs on f7 and d5',
    ],
  },
  {
    eco: ['C60', 'C99'],
    family: 'Ruy Lopez',
    structures: ['Closed Ruy Lopez', 'Open Ruy Lopez', 'Berlin Wall', 'Marshall Attack', 'Exchange Variation'],
    middlegame: {
      white: [
        'Closed: slow maneuvering with Nbd2-f1-g3, preparing d4-d5 or f4',
        'Maintain the bishop pair advantage when possible',
        'Play for d4-d5 central break in the Closed Variation',
        'Exchange: exploit the doubled f-pawns and play for an endgame',
        'Against Marshall: accurately defend and convert the extra pawn',
      ],
      black: [
        'Closed: play ...f5 for kingside counterplay (Breyer, Chigorin)',
        'Marshall Attack: sacrifice a pawn for a fierce kingside attack',
        'Berlin: endgame with bishop pair vs better structure',
        'Open: active piece play to compensate for structural weakness',
        'Play ...d5 break at the right moment to free the position',
      ],
    },
    attacking: [
      'Marshall Attack: ...Bf5, ...Qh4, ...Re6-h6 kingside storm',
      'White: d4-d5 central break in Closed Lopez',
      'Minority attack on the queenside with a4-a5 (Exchange Var.)',
      'f4 push for kingside aggression in various lines',
    ],
    tactics: [
      'Noah\'s Ark Trap (trapping the Ruy Lopez bishop)',
      'Pin on the e-file after removing the d-pawn',
      'Sacrifice on f7 or h7 in attacking positions',
      'Back rank combinations in the Marshall',
      'Knight maneuvers to f5 or d5',
    ],
  },

  // ── D: Closed Games ───────────────────────────────────────────────
  {
    eco: ['D00', 'D05'],
    family: 'Queen\'s Pawn (Various)',
    structures: ['Colle System', 'Veresov Attack', 'Blackmar-Diemer Gambit'],
    middlegame: {
      white: [
        'Colle: build up with e3, Bd3, O-O, then break with e4',
        'Veresov: pressure the center with Nc3 and Bg5',
        'Blackmar-Diemer: use development lead for tactical attacks',
      ],
      black: [
        'Challenge the center with ...c5 or ...e5',
        'Develop the light-squared bishop actively before ...e6',
        'Against Colle: prevent e4 or prepare counterplay early',
      ],
    },
    attacking: [
      'Colle: e4 central break leading to piece activity',
      'Blackmar-Diemer: piece sacrifices for fast development',
    ],
    tactics: [
      'Central break creating open lines for pieces',
      'Discovered attacks after pawn exchanges',
    ],
  },
  {
    eco: ['D06', 'D09'],
    family: 'Queen\'s Gambit (Various)',
    structures: ['QG symmetrical', 'Chigorin Defense', 'Albin Counter-Gambit'],
    middlegame: {
      white: [
        'Maintain central control with c4+d4',
        'Develop the light-squared bishop and complete development',
      ],
      black: [
        'Chigorin: active knight play to compensate for structural issues',
        'Albin: use the advanced d4 pawn for tactical play',
      ],
    },
    attacking: ['Central pressure and piece activity in the opening'],
    tactics: ['Lasker Trap in Albin', 'Tactical tricks with the advanced pawn'],
  },
  {
    eco: ['D10', 'D19'],
    family: 'Slav Defense',
    structures: ['Slav main line', 'Semi-Slav', 'Chebanenko Slav'],
    middlegame: {
      white: [
        'Play for e4 central break to open the position',
        'Develop the dark-squared bishop actively (Bg5 or Bf4)',
        'Pressure the c6 pawn and aim for queenside expansion',
      ],
      black: [
        'Develop the light-squared bishop to f5 or g4 early',
        'Play ...dxc4 and ...b5 for the Slav pawn grab',
        'Maintain solid central structure with ...c6 and ...e6',
        'Prepare ...c5 break to challenge the center',
      ],
    },
    attacking: [
      'White: e4 break opening the position favorably',
      'Semi-Slav: sharp attacks in the Meran and Anti-Meran',
      'Botvinnik System: dynamic pawn sacrifice for piece activity',
    ],
    tactics: [
      'Tactics around the c4 pawn and ...b5 advance',
      'Pin motifs on the c-file and d-file',
      'Meran gambit sacrifices for a kingside attack',
    ],
  },
  {
    eco: ['D20', 'D29'],
    family: 'Queen\'s Gambit Accepted',
    structures: ['QGA with ...a6/...b5', 'QGA central positions'],
    middlegame: {
      white: [
        'Regain the pawn and establish a strong center with e4',
        'Develop pieces rapidly with Nf3, Be2/Bd3, O-O',
        'Create an IQP position for dynamic piece play',
      ],
      black: [
        'Use the tempo gained from grabbing c4 to develop queenside',
        'Play ...c5 to challenge White\'s center',
        'Aim for solid equality with ...a6, ...b5, ...Bb7',
      ],
    },
    attacking: [
      'IQP-based attacks: Bc2+Qd3 battery, Nd5 outpost',
      'Kingside attack with pieces flooding to the kingside',
    ],
    tactics: [
      'IQP tactics: d4-d5 pawn break opening lines',
      'Discovered attacks after central pawn exchanges',
      'Queen and bishop battery on the b1-h7 diagonal',
    ],
  },
  {
    eco: ['D30', 'D69'],
    family: 'Queen\'s Gambit Declined',
    structures: ['Carlsbad structure', 'IQP positions', 'Tarrasch', 'Semi-Tarrasch', 'Orthodox'],
    middlegame: {
      white: [
        'Carlsbad: minority attack with a4-b4-b5 on the queenside',
        'Exchange Variation: exploit the isolated c-pawn after cxd5',
        'Target the backward c-pawn and use the c-file',
        'Maintain space advantage and maneuver in the center',
      ],
      black: [
        'Activate the light-squared bishop (the "QGD bishop")',
        'Play ...c5 to free the position and challenge d4',
        'Tarrasch: accept the IQP for active piece play',
        'Defend solidly with ...Nf6, ...Be7, ...O-O, then seek counterplay',
      ],
    },
    attacking: [
      'Minority attack: a4-b4-b5 to create weaknesses on c6',
      'Central break: e4 when Black is passive',
      'Kingside attack in positions with closed center',
    ],
    tactics: [
      'Carlsbad structure: minority attack creating targets',
      'IQP tactics: d4-d5 break, piece sacrifices on the kingside',
      'Pin on the d-file against the queen or king',
      'Exchange sacrifice on c3/c6 for positional compensation',
    ],
  },
  {
    eco: ['D70', 'D99'],
    family: 'Grunfeld Defense',
    structures: ['Grunfeld Exchange', 'Russian System', 'Fianchetto Grunfeld'],
    middlegame: {
      white: [
        'Exchange Variation: build and maintain a powerful pawn center',
        'Support the center with pieces and restrict Black\'s counterplay',
        'Use the extra central space for maneuvering',
      ],
      black: [
        'Attack the center with ...c5 and ...Nc6 pressure on d4',
        'Use the fianchetto bishop on g7 to pressure the center from distance',
        'Play ...cxd4 and ...Qa5+ in the Exchange to undermine the center',
        'Aim for dynamic piece play rather than static pawn structure',
      ],
    },
    attacking: [
      'White: use the pawn center to drive pieces forward',
      'Black: piece activity targeting the potentially overextended center',
      'Tactical strikes with ...Nxe4 or ...Bxd4 undermining moves',
    ],
    tactics: [
      'Tactics around the d4-c3 pawn chain',
      'Long diagonal (g7 bishop) tactical motifs',
      'Pawn break ...c5 combined with tactical shots',
      'Piece sacrifices on d4 or c3 to shatter the center',
    ],
  },

  // ── E: Indian Defenses ────────────────────────────────────────────
  {
    eco: ['E00', 'E09'],
    family: 'Catalan Opening',
    structures: ['Catalan with g3+Bg2', 'Open Catalan', 'Closed Catalan'],
    middlegame: {
      white: [
        'Fianchetto bishop on g2 creates long-term positional pressure',
        'Play for a4 to prevent ...b5 and restrict Black\'s queenside',
        'Regain the c4 pawn gradually while maintaining pressure',
        'Use the g2 bishop to dominate the long diagonal',
      ],
      black: [
        'In Open Catalan: keep the extra c4 pawn as long as possible',
        'Play ...a6 and ...b5 for queenside activity',
        'Develop the light-squared bishop to b7 for the long diagonal battle',
        'Closed: play ...c5 or ...dxc4 to open the position',
      ],
    },
    attacking: [
      'White: long-term pressure on the long diagonal (a8-h1)',
      'Positional squeeze with control of open files',
    ],
    tactics: [
      'Long diagonal pressure (Bg2 pinning/targeting pieces)',
      'Tactics along the c-file after pawn recovery',
      'Discovered attacks when the long diagonal opens',
    ],
  },
  {
    eco: ['E10', 'E19'],
    family: 'Queen\'s Indian / Bogo-Indian',
    structures: ['Queen\'s Indian fianchetto', 'Bogo-Indian with Bb4+'],
    middlegame: {
      white: [
        'Control e4 and build a broad center with d4+e4',
        'Restrict Black\'s fianchetto bishop and fight for the long diagonal',
        'Play for central breaks while maintaining space',
      ],
      black: [
        'Fianchetto on b7 to control e4 and the long diagonal',
        'Play ...c5 to challenge d4',
        'Aim for a flexible position that can adapt to White\'s setup',
        'Bogo: use the bishop pin to disrupt White\'s development',
      ],
    },
    attacking: [
      'White: central expansion with e4 when well prepared',
      'Black: counterplay on the queenside and along the long diagonal',
    ],
    tactics: [
      'Battle for the e4 square and long diagonal control',
      'Tactical motifs after ...c5 break',
      'Pin themes with the Bb4 in Bogo-Indian',
    ],
  },
  {
    eco: ['E20', 'E59'],
    family: 'Nimzo-Indian Defense',
    structures: ['Nimzo with doubled c-pawns', 'Nimzo IQP', 'Nimzo Rubinstein', 'Nimzo Classical'],
    middlegame: {
      white: [
        'Gain the bishop pair and use open lines for the bishops',
        'Play e4 to establish a strong center',
        'Accept doubled c-pawns for the bishop pair advantage',
        'Rubinstein: build center with e3, Bd3, Ne2, O-O, then e4',
      ],
      black: [
        'Use the pin on c3 to control e4 and restrain White\'s center',
        'Play ...c5 to challenge d4 and create open files',
        'Exchange on c3 (Bxc3) to saddle White with doubled pawns',
        'Aim for positions where the knight outperforms the bishop',
      ],
    },
    attacking: [
      'White: bishop pair advantage in open positions',
      'Black: piece pressure on the doubled c-pawns',
      'Central break e4 giving White initiative',
    ],
    tactics: [
      'Pin on c3 creating tactical problems for White',
      'Doubled pawn exploitation on the queenside',
      'IQP tactics when the position opens',
      'Knight outpost on e4 or c4',
    ],
  },
  {
    eco: ['E60', 'E69'],
    family: 'King\'s Indian (Fianchetto)',
    structures: ['Fianchetto KID', 'Panno Variation'],
    middlegame: {
      white: [
        'Fianchetto on g2 for a positional approach',
        'Play for queenside expansion with b4 or central play with e4',
        'Avoid sharp kingside attacks — play positionally',
      ],
      black: [
        'Play ...e5 then ...Nh5 and ...f5 for kingside attack',
        'Panno: ...Nc6, ...a6, ...Rb8, ...b5 for queenside counterplay',
        'Aim for ...f4 to clamp down on the kingside',
      ],
    },
    attacking: [
      'Black: ...f5-f4, ...g5, ...Rf7-h7 kingside storm',
      'White: queenside play with b4-c5',
    ],
    tactics: [
      'Kingside pawn storm tactics',
      'Tactical breaks with ...f4 or ...c5',
    ],
  },
  {
    eco: ['E70', 'E79'],
    family: 'King\'s Indian (Classical / Four Pawns)',
    structures: ['Classical KID', 'Four Pawns Attack'],
    middlegame: {
      white: [
        'Classical: d5 closes the center, then play on the queenside with c5',
        'Four Pawns: maintain the center and push for an advantage',
        'Expand on the queenside with b4, a4, Rb1',
      ],
      black: [
        'After d5: play ...f5 for kingside attack — the main plan',
        'Rush kingside pawns: ...f5, ...f4, ...g5, ...Rf7-h7, ...Bh6',
        'Time the ...f5 break to coincide with piece coordination',
      ],
    },
    attacking: [
      'Black: classic ...f5-f4, ...g5-g4 kingside storm',
      'White: c5-cxd6 queenside breakthrough',
      'Mutual attacks on opposite sides — tempo is critical',
    ],
    tactics: [
      'Sacrifice on h3 or g4 to open lines to the white king',
      'Central pawn breaks (...e5-e4 or c5-c6) changing the structure',
      'Rook lift (...Rf7-h7) for doubling on the h-file',
    ],
  },
  {
    eco: ['E80', 'E89'],
    family: 'King\'s Indian (Saemisch)',
    structures: ['Saemisch with f3', 'Saemisch Panno'],
    middlegame: {
      white: [
        'Castle queenside and play for a central/queenside attack',
        'Use f3 to support e4 and prevent ...Ng4',
        'Push d5 to close the center then expand on the queenside',
      ],
      black: [
        'Play ...c5 challenging d4, or ...e5 as in classical KID',
        'Castle kingside and play for ...f5 break',
        'Panno approach: ...a6, ...Nc6-a5, ...c5',
      ],
    },
    attacking: [
      'White: queenside castling with b4-c5 expansion',
      'Black: ...f5 kingside attack when center closes',
    ],
    tactics: [
      'Tactics around the f3 pawn weakening the kingside',
      'Central break ...e5 creating complications',
    ],
  },
  {
    eco: ['E90', 'E99'],
    family: 'King\'s Indian (Main Lines)',
    structures: ['Classical KID Main Line', 'Mar del Plata', 'Bayonet Attack'],
    middlegame: {
      white: [
        'Classical: close the center with d5, then c5 queenside expansion',
        'Bayonet Attack (b4): expand on queenside before Black\'s kingside attack',
        'Nc3-d3-e1-d3 knight maneuver for optimal placement',
      ],
      black: [
        'The race: ...f5-f4, ...g5, ...Rf6-h6, ...Bh6 for a kingside storm',
        'Time the ...f5 break precisely — too early or late is losing',
        'Against Bayonet: ignore the queenside and attack at full speed',
        'Use ...Nf6-d7-f8-g6 maneuver to bring pieces to the kingside',
      ],
    },
    attacking: [
      'Mar del Plata: classic mutual attacks on opposite flanks',
      'Black: ...g4 pawn sacrifice to open the g-file',
      'White: c5-c6 breakthrough to create a passed pawn',
      'Sacrifice on h3 to rip open the white king',
    ],
    tactics: [
      'Kingside sacrifice themes (Nxg4, Bxh3, ...Rxf3)',
      'Pawn break ...g4 opening the g-file for attack',
      'Deflection sacrifices to remove defenders of the king',
      'Zwischenzug in the pawn race — every tempo counts',
    ],
  },
];

export default THEMES;
