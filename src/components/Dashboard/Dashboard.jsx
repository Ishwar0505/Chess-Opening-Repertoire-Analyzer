import { useAppState, useAppDispatch } from '../../context/AppContext';
import { useRepertoire } from '../../hooks/useRepertoire';
import { useMasterData } from '../../hooks/useMasterData';
import TabBar from '../common/TabBar';
import StatBar from '../common/StatBar';
import styles from './Dashboard.module.css';

const COLOR_TABS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
];

const SORT_OPTIONS = [
  { value: 'frequency', label: 'Most Played' },
  { value: 'winRate', label: 'Win Rate' },
  { value: 'eco', label: 'ECO Code' },
  { value: 'name', label: 'Name' },
  { value: 'recent', label: 'Recent' },
  { value: 'rating', label: 'Avg Rating' },
];

export default function Dashboard({ games, username }) {
  const { activeColor, sortBy, selectedOpening } = useAppState();
  const dispatch = useAppDispatch();
  const { openings, totalGames } = useRepertoire(games, username, activeColor, sortBy);
  const { masterData, loading: masterLoading } = useMasterData(openings, username);

  // Aggregate stats for the active color
  const totals = openings.reduce(
    (acc, o) => {
      acc.wins += o.wins;
      acc.draws += o.draws;
      acc.losses += o.losses;
      return acc;
    },
    { wins: 0, draws: 0, losses: 0 }
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.controls}>
        <TabBar
          tabs={COLOR_TABS}
          activeTab={activeColor}
          onTabChange={(color) => dispatch({ type: 'SET_COLOR', color })}
        />

        <div className={styles.sortControl}>
          <label htmlFor="sortBy">Sort:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => dispatch({ type: 'SET_SORT', sortBy: e.target.value })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryText}>
          {openings.length} opening{openings.length !== 1 ? 's' : ''} from{' '}
          {totalGames} game{totalGames !== 1 ? 's' : ''} as {activeColor}
        </span>
        <div className={styles.summaryBar}>
          <StatBar
            wins={totals.wins}
            draws={totals.draws}
            losses={totals.losses}
            total={totalGames}
          />
        </div>
      </div>

      {openings.length === 0 ? (
        <p className={styles.empty}>No openings found for this color.</p>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.colEco}>ECO</span>
            <span className={styles.colName}>Opening</span>
            <span className={styles.colGames}>Games</span>
            <span className={styles.colWinRate}>Win %</span>
            <span className={styles.colMasters}>Masters</span>
            <span className={styles.colBar}>W / D / L</span>
          </div>

          {openings.map((opening) => {
            const isSelected = selectedOpening?.eco === opening.eco
              && selectedOpening?.name === opening.name;
            const key = `${opening.eco}|${opening.name}`;
            const master = masterData[key];

            return (
              <button
                key={`${opening.eco}-${opening.name}`}
                className={`${styles.row} ${styles.dataRow} ${isSelected ? styles.selected : ''}`}
                onClick={() =>
                  dispatch({
                    type: 'SELECT_OPENING',
                    opening: isSelected ? null : opening,
                  })
                }
              >
                <span className={styles.colEco}>{opening.eco}</span>
                <span className={styles.colName}>{opening.name}</span>
                <span className={styles.colGames}>{opening.games}</span>
                <span className={styles.colWinRate}>
                  {Math.round(opening.winRate * 100)}%
                </span>
                <span className={styles.colMasters}>
                  {master ? master.totalGames.toLocaleString() : (masterLoading ? '...' : '-')}
                </span>
                <span className={styles.colBar}>
                  <StatBar
                    wins={opening.wins}
                    draws={opening.draws}
                    losses={opening.losses}
                    total={opening.games}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
