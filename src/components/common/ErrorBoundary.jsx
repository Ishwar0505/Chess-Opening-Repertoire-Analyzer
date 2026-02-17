import { Component } from 'react';
import styles from './common.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.error}>
          <p className={styles.errorText}>
            {this.props.fallbackMessage || 'Something went wrong rendering this section.'}
          </p>
          <button className={styles.retryButton} onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
