import styles from './common.module.css';

export default function LoadingSpinner({ message }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner} />
      {message && <p className={styles.spinnerMessage}>{message}</p>}
    </div>
  );
}
