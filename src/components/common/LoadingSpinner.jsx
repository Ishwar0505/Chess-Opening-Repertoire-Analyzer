import styles from './common.module.css';

export default function LoadingSpinner({ message }) {
  return (
    <div className={styles.spinnerContainer} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      {message && <p className={styles.spinnerMessage}>{message}</p>}
    </div>
  );
}
