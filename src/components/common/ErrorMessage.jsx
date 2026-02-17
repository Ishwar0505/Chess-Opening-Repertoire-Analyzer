import styles from './common.module.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.error}>
      <p className={styles.errorText}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
