import styles from './common.module.css';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
