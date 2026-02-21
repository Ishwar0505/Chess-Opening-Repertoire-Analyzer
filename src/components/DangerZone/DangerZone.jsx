import styles from './DangerZone.module.css';

/**
 * Displays the Practicality Gap / Danger Zone analysis for an opening.
 * Shows the gap between engine evaluation and actual human win rates.
 *
 * @param {{ gap: Object }} props
 */
export default function DangerZone({ gap }) {
  if (!gap) return null;

  const containerClass = `${styles.container} ${gap.isDangerZone ? styles.danger : styles.safe}`;

  return (
    <div className={containerClass}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          {gap.isDangerZone ? 'Danger Zone' : 'Practicality Check'}
        </h4>
        <span className={styles.score}>
          Gap: {(gap.discrepancyScore * 100).toFixed(0)}%
        </span>
      </div>

      <div className={styles.comparison}>
        <div className={styles.metric}>
          <span className={styles.label}>Engine</span>
          <span className={styles.value}>{gap.engineEvalText}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>White Wins</span>
          <span className={styles.value}>
            {Math.round(gap.humanStats.whiteWinRate * 100)}%
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Black Wins</span>
          <span className={styles.value}>
            {Math.round(gap.humanStats.blackWinRate * 100)}%
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>DB Games</span>
          <span className={styles.value}>
            {gap.humanStats.total.toLocaleString()}
          </span>
        </div>
      </div>

      {gap.isDangerZone && gap.dangerDescription && (
        <p className={styles.description}>{gap.dangerDescription}</p>
      )}
    </div>
  );
}
