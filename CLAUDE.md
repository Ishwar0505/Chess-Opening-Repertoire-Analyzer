# Chess Moves

A web-based chess opening repertoire analyzer built with React.

## Tech Stack

- React 18+ with Vite
- CSS Modules for component styling
- No state management library (React Context + useReducer for shared state)
- No backend — all API calls go directly to Lichess (CORS-friendly)

## Project Structure

- `src/` — All source code
  - `src/components/` — React components
  - `src/hooks/` — Custom React hooks
  - `src/services/` — API clients and data services
  - `src/data/` — Static data (opening themes database)
  - `src/utils/` — Pure utility functions
  - `src/context/` — React Context providers
- `public/assets/` — Chess piece SVGs and static assets

## Development

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Conventions

- Functional components only (no class components)
- Custom hooks for reusable logic (prefix with `use`)
- PascalCase for components, camelCase for functions/variables
- One component per file, filename matches component name
- CSS Modules: `ComponentName.module.css` alongside component file
- Keep components focused — split when a component exceeds ~150 lines
