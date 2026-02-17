import styles from './common.module.css';

export default function EmptyState({ icon, title, message }) {
  return (
    <div className={styles.emptyState}>
      {icon && <span className={styles.emptyIcon}>{icon}</span>}
      {title && <p className={styles.emptyTitle}>{title}</p>}
      {message && <p className={styles.emptyMessage}>{message}</p>}
    </div>
  );
}
