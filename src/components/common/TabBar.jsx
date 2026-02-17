import styles from './common.module.css';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabBar} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.value)}
          role="tab"
          aria-selected={activeTab === tab.value}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
