import { memo } from 'react';
import styles from './common.module.css';

export default memo(function StatBar({ wins, draws, losses, total }) {
  if (!total) return null;

  const winPct = (wins / total) * 100;
  const drawPct = (draws / total) * 100;
  const lossPct = (losses / total) * 100;

  return (
    <div
      className={styles.statBar}
      role="img"
      aria-label={`Wins: ${wins} (${winPct.toFixed(1)}%), Draws: ${draws} (${drawPct.toFixed(1)}%), Losses: ${losses} (${lossPct.toFixed(1)}%)`}
    >
      <div
        className={styles.statSegment}
        style={{ width: `${winPct}%`, backgroundColor: 'var(--success)' }}
        title={`Wins: ${wins} (${winPct.toFixed(1)}%)`}
        aria-hidden="true"
      >
        {winPct > 15 && <span>{winPct.toFixed(0)}%</span>}
      </div>
      <div
        className={styles.statSegment}
        style={{ width: `${drawPct}%`, backgroundColor: 'var(--warning)' }}
        title={`Draws: ${draws} (${drawPct.toFixed(1)}%)`}
        aria-hidden="true"
      >
        {drawPct > 15 && <span>{drawPct.toFixed(0)}%</span>}
      </div>
      <div
        className={styles.statSegment}
        style={{ width: `${lossPct}%`, backgroundColor: 'var(--error)' }}
        title={`Losses: ${losses} (${lossPct.toFixed(1)}%)`}
        aria-hidden="true"
      >
        {lossPct > 15 && <span>{lossPct.toFixed(0)}%</span>}
      </div>
    </div>
  );
})
