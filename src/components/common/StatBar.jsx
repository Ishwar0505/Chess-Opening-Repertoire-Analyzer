import styles from './common.module.css';

export default function StatBar({ wins, draws, losses, total }) {
  if (!total) return null;

  const winPct = (wins / total) * 100;
  const drawPct = (draws / total) * 100;
  const lossPct = (losses / total) * 100;

  return (
    <div className={styles.statBar}>
      <div
        className={styles.statSegment}
        style={{ width: `${winPct}%`, backgroundColor: 'var(--success)' }}
        title={`Wins: ${wins} (${winPct.toFixed(1)}%)`}
      >
        {winPct > 15 && <span>{winPct.toFixed(0)}%</span>}
      </div>
      <div
        className={styles.statSegment}
        style={{ width: `${drawPct}%`, backgroundColor: 'var(--warning)' }}
        title={`Draws: ${draws} (${drawPct.toFixed(1)}%)`}
      >
        {drawPct > 15 && <span>{drawPct.toFixed(0)}%</span>}
      </div>
      <div
        className={styles.statSegment}
        style={{ width: `${lossPct}%`, backgroundColor: 'var(--error)' }}
        title={`Losses: ${losses} (${lossPct.toFixed(1)}%)`}
      >
        {lossPct > 15 && <span>{lossPct.toFixed(0)}%</span>}
      </div>
    </div>
  );
}
