import styles from './PlayerInfo.module.css';

const PERF_LABELS = {
  bullet: 'Bullet',
  blitz: 'Blitz',
  rapid: 'Rapid',
  classical: 'Classical',
  correspondence: 'Corresp.',
};

export default function PlayerInfo({ profile }) {
  if (!profile) return null;

  const { username, perfs, count, createdAt, title } = profile;

  // Collect ratings for display
  const ratings = [];
  for (const [key, label] of Object.entries(PERF_LABELS)) {
    if (perfs?.[key]?.games > 0) {
      ratings.push({
        key,
        label,
        rating: perfs[key].rating,
        games: perfs[key].games,
      });
    }
  }

  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.nameRow}>
          {title && <span className={styles.title}>{title}</span>}
          <h2 className={styles.username}>{username}</h2>
        </div>
        <div className={styles.meta}>
          {count?.all != null && (
            <span>{count.all.toLocaleString()} games</span>
          )}
          {memberSince && <span>Since {memberSince}</span>}
        </div>
      </div>

      {ratings.length > 0 && (
        <div className={styles.ratings}>
          {ratings.map((r) => (
            <div key={r.key} className={styles.ratingItem}>
              <span className={styles.ratingLabel}>{r.label}</span>
              <span className={styles.ratingValue}>{r.rating}</span>
              <span className={styles.ratingGames}>
                {r.games.toLocaleString()} games
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
