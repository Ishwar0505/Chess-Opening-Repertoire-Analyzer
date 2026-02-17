# Chess Opening Repertoire Analyzer — Technical Specification

## 1. Project Overview

**Name:** Chess Opening Repertoire Analyzer
**Type:** React single-page application (Vite, no backend)
**Purpose:** Analyze a Lichess player's opening repertoire, match with master games, and provide middlegame strategy insights

---

## 2. File Structure

```
Chess Moves/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       └── pieces/                 # Chess piece SVGs
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root component, layout shell
│   ├── App.module.css              # Root layout styles
│   ├── index.css                   # Global styles, CSS variables, resets
│   ├── components/
│   │   ├── SearchBar/
│   │   ├── PlayerInfo/
│   │   ├── Dashboard/
│   │   ├── OpeningCard/
│   │   ├── Chessboard/
│   │   ├── GameViewer/
│   │   ├── MoveTree/
│   │   └── common/                 # LoadingSpinner, ErrorMessage, TabBar, StatBar
│   ├── hooks/
│   ├── context/
│   │   └── AppContext.jsx
│   ├── services/
│   │   ├── lichessApi.js
│   │   ├── explorerApi.js
│   │   ├── cloudEvalApi.js
│   │   ├── requestQueue.js
│   │   └── cache.js
│   ├── analysis/
│   │   ├── repertoire.js
│   │   ├── masterMatch.js
│   │   └── strategy.js
│   ├── data/
│   │   └── openingThemes.js
│   └── utils/
│       ├── chess.js
│       ├── stream.js
│       └── helpers.js
```

---

## 3. Key API Endpoints

| Purpose | Endpoint | Base URL |
|---------|----------|----------|
| Player games | `GET /api/games/user/{username}` | lichess.org |
| Player profile | `GET /api/user/{username}` | lichess.org |
| Masters database | `GET /masters` | explorer.lichess.ovh |
| Player explorer | `GET /player` | explorer.lichess.ovh |
| Master game PGN | `GET /master/pgn/{gameId}` | explorer.lichess.ovh |
| Cloud evaluation | `GET /api/cloud-eval` | lichess.org |

No authentication required. All CORS-friendly.

---

## 4. Color Scheme (CSS Custom Properties)

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-surface: #16213e;
  --bg-elevated: #0f3460;
  --accent: #e94560;
  --text-primary: #eeeeee;
  --text-secondary: #a0a0b0;
  --success: #4ecca3;
  --warning: #f0c040;
  --error: #e94560;
  --board-light: #f0d9b5;
  --board-dark: #b58863;
}
```

---

## 5. Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.3.1"
  }
}
```

No other runtime dependencies. Chess logic, PGN parsing, board rendering — all built from scratch.

---

## 6. Performance Targets

| Metric | Target |
|--------|--------|
| Production build size | < 200KB gzipped |
| Game fetch (200 games) | < 5 seconds |
| Full analysis complete | < 30 seconds |
| Board re-render | < 16ms (60fps) |

---

## 7. Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
