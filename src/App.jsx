import { AppProvider, useAppState } from './context/AppContext';
import SearchBar from './components/SearchBar/SearchBar';
import PlayerInfo from './components/PlayerInfo/PlayerInfo';
import Dashboard from './components/Dashboard/Dashboard';
import OpeningCard from './components/OpeningCard/OpeningCard';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import styles from './App.module.css';

function AppContent() {
  const { username, profile, games, gamesLoading, gamesProgress, selectedOpening, error } = useAppState();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>&#9822;</span>
        <h1 className={styles.title}>Chess Opening Repertoire Analyzer</h1>
      </header>

      <SearchBar />

      <main className={styles.main}>
        {error && <ErrorMessage message={error} />}

        {gamesLoading && (
          <LoadingSpinner
            message={`Loading games... ${gamesProgress.loaded} fetched`}
          />
        )}

        {!gamesLoading && !profile && !error && (
          <div className={styles.welcome}>
            <h2>Analyze Your Opening Repertoire</h2>
            <p>
              Enter a Lichess username to extract their opening repertoire,
              match it with master games, and discover middlegame ideas,
              attacking strategies, and tactical patterns.
            </p>
          </div>
        )}

        {profile && <PlayerInfo profile={profile} />}

        {!gamesLoading && profile && games.length > 0 && (
          <Dashboard games={games} username={username} />
        )}

        {selectedOpening && !gamesLoading && (
          <OpeningCard opening={selectedOpening} />
        )}

        {!gamesLoading && profile && games.length === 0 && !error && (
          <ErrorMessage message="No games found with these filters. Try different settings." />
        )}
      </main>

      <footer className={styles.footer}>
        Powered by the Lichess API
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
