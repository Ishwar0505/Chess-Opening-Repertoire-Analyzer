# Chess Opening Repertoire Analyzer — Implementation Plan

## Vision

A web app that takes a Lichess username, extracts the player's opening repertoire from their games, matches each opening against master-level games from the Lichess masters database, and provides actionable middlegame ideas, attacking strategies, and common tactical patterns to set up.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│               React SPA (Vite + React 18)           │
├─────────────┬───────────────┬───────────────────────┤
│  Components │  Custom Hooks │  Services Layer       │
│             │               │                       │
│ - SearchBar │ - usePlayer   │ - lichessApi.js       │
│ - Dashboard │ - useRepert.  │ - explorerApi.js      │
│ - Opening   │ - useMasters  │ - cloudEvalApi.js     │
│   Card      │ - useAnalysis │                       │
│ - Board     │               │  Analysis Engine      │
│ - GameView  │  Context      │ - repertoire.js       │
│ - MoveTree  │ - AppContext  │ - masterMatch.js      │
│             │               │ - strategy.js         │
└─────────────┴───────────────┴───────────────────────┘
         │                            │
         ▼                            ▼
   ┌───────────┐          ┌─────────────────────┐
   │  Browser  │          │   Lichess APIs       │
   │  Storage  │          │                      │
   │ (cache)   │          │ lichess.org/api      │
   └───────────┘          │ explorer.lichess.ovh │
                          └─────────────────────┘
```

## Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** CSS Modules (component-scoped styles)
- **State:** React Context + useReducer (no external state library)
- **APIs:** Lichess Game Export API + Opening Explorer API (Masters + Player)
- **Storage:** localStorage for caching
- **No backend required** — all API calls are CORS-friendly from Lichess

---

## Data Flow

### Step 1: Fetch Player's Opening Repertoire
1. User enters Lichess username + filters (time control, color, date range)
2. `usePlayerGames` hook calls `lichessApi.streamPlayerGames()` with `opening=true`
3. Games stream into state via reducer, grouped by ECO code + opening name
4. Dashboard re-renders progressively as games arrive

### Step 2: Query Masters Database for Each Opening
1. For each unique opening in the player's repertoire, use the move sequence (UCI format)
2. `useMasterData` hook calls `explorerApi.queryMasters()` for each opening
3. Fetches top master games (`topGames` param) per opening
4. Master game PGNs fetched on demand when user opens a detail card

### Step 3: Analyze & Generate Insights
1. Compare player's move choices vs. master preferences at each branching point
2. Identify the critical divergence points (where player deviates from master lines)
3. Extract middlegame structures from master games (pawn structure, piece placement)
4. Map openings to known strategic themes and tactical motifs from `openingThemes.js`
5. Use cloud eval (`cloudEvalApi.getEval()`) for key positions

### Step 4: Present Results
1. `<Dashboard>` with opening repertoire overview (sortable table)
2. `<OpeningCard>` detail view with: master comparison, key ideas, model games
3. `<MoveTree>` showing player vs. master move preferences
4. `<Board>` + `<GameViewer>` for browsing master games interactively

---

## Implementation Phases

### Phase 1: Foundation (Project Setup & Core Infrastructure) ✅
- Vite + React project scaffolding
- Services layer (API clients, ndjson parser, request queue, cache)
- App shell with layout
- `<SearchBar>` component with validation
- Common components (LoadingSpinner, ErrorMessage, TabBar, StatBar)

### Phase 2: Repertoire Extraction & Dashboard
- `usePlayerGames` hook (streaming with progress)
- Repertoire building logic (group by ECO, calc stats)
- `<Dashboard>` component with sortable table
- `<PlayerInfo>` component (profile, rating)
- White/Black tab switching

### Phase 3: Masters Database Integration
- `useMasterData` hook for opening-level master queries
- Chess utility functions (SAN/UCI conversion, PGN parsing)
- Move comparison logic (player vs. master choices)
- `<OpeningCard>` component with master stats and game list

### Phase 4: Strategic Analysis Engine
- Opening themes database (`openingThemes.js`)
- Strategy generation engine
- Strategy display sections in `<OpeningCard>`
- Cloud evaluation integration for critical positions

### Phase 5: Interactive Board & Polish
- `<Chessboard>` SVG component
- `<GameViewer>` with PGN navigation
- `<MoveTree>` comparison visualization
- Responsive design, error/empty states, performance tuning

---

## Key API Endpoints Used

| Purpose | Endpoint | Base URL |
|---------|----------|----------|
| Player games | `GET /api/games/user/{username}` | lichess.org |
| Player profile | `GET /api/user/{username}` | lichess.org |
| Player opening stats | `GET /player` | explorer.lichess.ovh |
| Masters database | `GET /masters` | explorer.lichess.ovh |
| Master game PGN | `GET /master/pgn/{gameId}` | explorer.lichess.ovh |
| Cloud evaluation | `GET /api/cloud-eval` | lichess.org |

**No authentication required** for any of these endpoints (all public data).

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Rate limiting (HTTP 429) | Request queue in service layer with delays; cache aggressively |
| Large game volumes | Stream ndjson; limit initial fetch to 200 games; paginate with `since/until` |
| Player explorer indexing delay | Show queue position; use pre-fetched game data as fallback |
| No server-side opening filter | Client-side grouping after fetch (efficient with ndjson streaming) |
| CORS issues | Lichess APIs are CORS-friendly; no proxy needed |

---

## Strategic Theme Database

The app will include a built-in knowledge base mapping ECO codes to middlegame themes:

- **Pawn structures:** IQP, Carlsbad, French structure, Maroczy Bind, etc.
- **Attacking patterns:** Greek gift sacrifice, Bxh7+, kingside pawn storms, minority attack
- **Piece maneuvers:** Knight outposts, bishop pair advantage, rook lifts
- **Positional themes:** Space advantage, piece activity, weak squares, open files
- **Tactical motifs:** Pins, forks, discovered attacks, back rank, deflection

This data is hardcoded (no API needed) and organized by ECO code ranges.
