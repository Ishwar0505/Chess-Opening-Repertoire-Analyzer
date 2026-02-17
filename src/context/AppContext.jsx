import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  // Search
  username: null,
  filters: { perfType: 'all', color: 'both', maxGames: 200 },

  // Player data
  profile: null,
  games: [],
  gamesLoading: false,
  gamesProgress: { loaded: 0 },

  // Repertoire
  activeColor: 'white',
  sortBy: 'frequency',

  // Selected opening detail
  selectedOpening: null,

  // UI state
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...initialState,
        username: action.username,
        filters: action.filters,
        gamesLoading: true,
      };

    case 'PROFILE_LOADED':
      return { ...state, profile: action.profile };

    case 'GAME_RECEIVED':
      return {
        ...state,
        games: [...state.games, action.game],
        gamesProgress: { loaded: state.games.length + 1 },
      };

    case 'GAMES_COMPLETE':
      return { ...state, gamesLoading: false };

    case 'SET_COLOR':
      return { ...state, activeColor: action.color, selectedOpening: null };

    case 'SET_SORT':
      return { ...state, sortBy: action.sortBy };

    case 'SELECT_OPENING':
      return { ...state, selectedOpening: action.opening };

    case 'SET_ERROR':
      return { ...state, error: action.error, gamesLoading: false };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === null) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}
