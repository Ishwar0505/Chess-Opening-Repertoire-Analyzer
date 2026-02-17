# Chess Opening Repertoire Analyzer

A web app that analyzes your Lichess opening repertoire — compare your moves against master games, discover middlegame ideas, attacking strategies, and tactical patterns.

**Live:** [chess-opening-repertoire-analyzer.vercel.app](https://chess-opening-repertoire-analyzer.vercel.app/)

## Features

- **Opening Repertoire Extraction** — Fetches your Lichess games and groups them by ECO code and opening name
- **Masters Database Comparison** — Matches your opening moves against the Lichess masters database with move-by-move analysis
- **Win/Draw/Loss Statistics** — Per-opening stats with visual stat bars, sortable by frequency, win rate, ECO code, or rating
- **Cloud Stockfish Evaluation** — Fetches cloud engine evaluations for key positions
- **Strategic Analysis** — Pawn structures, middlegame ideas, attacking strategies, tactical motifs, and opponent plans for each opening
- **Interactive Chessboard** — SVG chessboard with PGN navigation and move highlighting
- **Notable Master Games** — Browse top master games for each opening with an embedded game viewer
- **Multiple Time Controls** — Filter by blitz, rapid, bullet, classical, or correspondence

## Tech Stack

- React 19 + Vite 7
- CSS Modules for scoped styling
- React Context + useReducer for state management
- No backend — all API calls go directly to Lichess (CORS-friendly)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── analysis/        # Master game matching logic
├── components/
│   ├── Chessboard/  # SVG chessboard renderer
│   ├── Dashboard/   # Opening repertoire table
│   ├── GameViewer/  # Interactive PGN game viewer
│   ├── MoveTree/    # Move-by-move comparison tree
│   ├── OpeningCard/ # Detailed opening analysis card
│   ├── PlayerInfo/  # Lichess player profile display
│   ├── SearchBar/   # Username input and filters
│   └── common/      # Shared UI components (StatBar, TabBar, etc.)
├── context/         # React Context (AppContext)
├── data/            # Static data (opening themes, piece SVGs)
├── hooks/           # Custom hooks (useRepertoire, useMasterData, useAnalysis)
├── services/        # API clients (Lichess, cloud eval, request queue)
└── utils/           # Pure utilities (chess logic, FEN/PGN parsing)
```

## APIs Used

- [Lichess API](https://lichess.org/api) — Game export, player profiles
- [Lichess Opening Explorer](https://lichess.org/api#tag/Opening-Explorer) — Masters database queries
- [Lichess Cloud Eval](https://lichess.org/api#tag/Analysis) — Stockfish evaluations

## License

MIT
