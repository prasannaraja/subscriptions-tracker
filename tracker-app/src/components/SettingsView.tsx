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
            <button
              style={{ ...styles.ghostBtn, borderStyle: 'dashed' }}
              onClick={() => {
                const template = {
                  subscriptions: [],
                  commitments: {
                    family: [
                      { id: "family-1", name: "Child daycare", amount: 400, currency: baseCurrency, cycle: "monthly", notes: "Daycare fees - Monday to Friday", startDate: "2025-01-15", active: true },
                      { id: "family-2", name: "Child tuition (Primary)", amount: 1200, currency: baseCurrency, cycle: "monthly", notes: "Private school fees", startDate: "2025-09-01", active: true },
                      { id: "family-3", name: "Child tuition (Secondary)", amount: 1800, currency: baseCurrency, cycle: "monthly", notes: "Secondary school fees", startDate: "2025-09-01", active: true },
                      { id: "family-4", name: "Elderly parent care", amount: 600, currency: baseCurrency, cycle: "monthly", notes: "Nursing home and medical support", startDate: "2024-06-01", active: true },
                      { id: "family-5", name: "Child music lessons", amount: 150, currency: baseCurrency, cycle: "monthly", notes: "Piano lessons - weekly sessions", startDate: "2025-01-10", active: true },
                      { id: "family-6", name: "Child sports program", amount: 200, currency: baseCurrency, cycle: "monthly", notes: "Swimming and martial arts", startDate: "2025-02-01", active: true },
                      { id: "family-7", name: "Family health insurance", amount: 450, currency: baseCurrency, cycle: "monthly", notes: "Additional premium coverage", startDate: "2024-01-01", active: true },
                      { id: "family-8", name: "Child daycare (second child)", amount: 350, currency: baseCurrency, cycle: "monthly", notes: "After-school care", startDate: "2025-03-01", active: true },
                      { id: "family-9", name: "University fund contribution", amount: 500, currency: baseCurrency, cycle: "monthly", notes: "Education savings for children", startDate: "2023-01-01", active: true },
                      { id: "family-10", name: "Spouse allowance", amount: 800, currency: baseCurrency, cycle: "monthly", notes: "Monthly spending budget", startDate: "2025-01-01", active: true }
                    ],
                    loans: [
                      { id: "loan-1", name: "Home Mortgage", principal: 250000, currency: baseCurrency, monthlyPayment: 1850, interestRate: 3.2, startDate: "2020-06-15", termMonths: 360, remainingBalance: 220000, notes: "30-year fixed rate mortgage" },
                      { id: "loan-2", name: "Car loan - Sedan", principal: 35000, currency: baseCurrency, monthlyPayment: 650, interestRate: 4.1, startDate: "2022-08-01", termMonths: 60, remainingBalance: 18500, notes: "Vehicle financed at dealership" },
                      { id: "loan-3", name: "Car loan - SUV", principal: 45000, currency: baseCurrency, monthlyPayment: 825, interestRate: 4.5, startDate: "2023-03-15", termMonths: 72, remainingBalance: 38000, notes: "Family SUV for transportation" },
                      { id: "loan-4", name: "Student loan (Personal)", principal: 22000, currency: baseCurrency, monthlyPayment: 220, interestRate: 5.5, startDate: "2018-06-01", termMonths: 120, remainingBalance: 12000, notes: "Undergraduate degree" },
                      { id: "loan-5", name: "Student loan (Partner)", principal: 18000, currency: baseCurrency, monthlyPayment: 180, interestRate: 4.8, startDate: "2019-09-01", termMonths: 120, remainingBalance: 8500, notes: "Master's degree" },
                      { id: "loan-6", name: "Home renovation credit", principal: 15000, currency: baseCurrency, monthlyPayment: 350, interestRate: 6.2, startDate: "2024-02-01", termMonths: 48, remainingBalance: 13500, notes: "Kitchen and bathroom upgrade" },
                      { id: "loan-7", name: "Personal loan - Medical", principal: 8000, currency: baseCurrency, monthlyPayment: 300, interestRate: 7.5, startDate: "2024-05-01", termMonths: 30, remainingBalance: 6000, notes: "Dental and vision procedures" },
                      { id: "loan-8", name: "Business equipment loan", principal: 12000, currency: baseCurrency, monthlyPayment: 280, interestRate: 5.8, startDate: "2023-11-01", termMonths: 48, remainingBalance: 6500, notes: "Computer and office setup" },
                      { id: "loan-9", name: "Credit card debt", principal: 5200, currency: baseCurrency, monthlyPayment: 350, interestRate: 18.9, startDate: "2024-01-15", termMonths: 18, remainingBalance: 3200, notes: "High interest - prioritize payoff" },
                      { id: "loan-10", name: "Line of credit", principal: 10000, currency: baseCurrency, monthlyPayment: 150, interestRate: 7.2, startDate: "2023-04-01", termMonths: 84, remainingBalance: 7800, notes: "Emergency backup funding" }
                    ]
                  },
                  meta: { generatedAt: new Date().toISOString(), schemaVersion: 1 }
                };
                const dataStr = JSON.stringify(template, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "subscriptions-template.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download template JSON
            </button>
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
