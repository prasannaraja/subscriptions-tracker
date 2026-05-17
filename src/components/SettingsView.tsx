import type { Subscription } from "../types";
import { formatCurrency } from "../utils";
import { styles } from "../styles/theme";

interface SettingsViewProps {
  activeCount: number;
  baseCurrency: string;
  exportData: () => void;
  importData: () => void;
  monthlyTotal: number;
  pausedCount: number;
  resetToSeedData: () => void;
  subscriptions: Subscription[];
  yearlyTotal: number;
}

export function SettingsView({
  activeCount,
  baseCurrency,
  exportData,
  importData,
  monthlyTotal,
  pausedCount,
  resetToSeedData,
  subscriptions,
  yearlyTotal,
}: SettingsViewProps) {
  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Settings</h1>
          <p style={styles.pageSubtitle}>Manage local data and app preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Data Storage</h2>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingTitle}>Storage location</div>
              <div style={styles.settingDescription}>Browser localStorage key: _subs_v1</div>
            </div>
            <span style={styles.settingBadge}>Local</span>
          </div>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingTitle}>Subscriptions</div>
              <div style={styles.settingDescription}>
                {activeCount} active, {pausedCount} paused
              </div>
            </div>
            <span style={styles.settingValue}>{subscriptions.length}</span>
          </div>
          <div style={styles.settingActions}>
            <button style={styles.primaryBtn} onClick={exportData}>Export JSON</button>
            <button style={styles.ghostBtn} onClick={importData}>Import JSON</button>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Spend Summary</h2>
          <div style={styles.settingMetric}>
            <span style={styles.settingDescription}>Monthly</span>
            <strong style={styles.settingValue}>{formatCurrency(monthlyTotal, baseCurrency)}</strong>
          </div>
          <div style={styles.settingMetric}>
            <span style={styles.settingDescription}>Yearly</span>
            <strong style={styles.settingValue}>{formatCurrency(yearlyTotal, baseCurrency)}</strong>
          </div>
          <div style={styles.settingMetric}>
            <span style={styles.settingDescription}>Base currency</span>
            <strong style={styles.settingValue}>{baseCurrency}</strong>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Sample Data</h2>
          <p style={styles.settingDescription}>
            Restore the bundled sample subscriptions when you want a clean learning dataset.
          </p>
          <div style={styles.settingActions}>
            <button style={styles.ghostBtn} onClick={resetToSeedData}>Restore Sample Data</button>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Application</h2>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingTitle}>Architecture</div>
              <div style={styles.settingDescription}>React, Redux Toolkit, Vite, Electron shell</div>
            </div>
          </div>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingTitle}>Persistence</div>
              <div style={styles.settingDescription}>Validated JSON in localStorage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
