import type { Subscription, Preset } from '../types';
import { formatCurrency } from '../utils';
import { styles } from '../styles/theme';
import { StatCard } from './StatCard';
import { SpendByCategory } from './SpendByCategory';
import { UpcomingRenewals } from './UpcomingRenewals';
import { QuickAdd } from './QuickAdd';

interface DashboardProps {
  subs: Subscription[];
  activeSubs: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
  byCategory: Record<string, number>;
  upcoming: (Subscription & { nextDate: string })[];
  openAdd: (preset?: Preset) => void;
  openEdit: (sub: Subscription) => void;
  baseCurrency: string;
}

export function Dashboard({
  subs,
  activeSubs,
  monthlyTotal,
  yearlyTotal,
  byCategory,
  upcoming,
  openAdd,
  openEdit,
  baseCurrency,
}: DashboardProps) {
  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>
            {activeSubs.length} active subscription{activeSubs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button style={styles.primaryBtn} onClick={() => openAdd()}>
          + Add New
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-stats">
        <StatCard
          label="Monthly Spend"
          value={formatCurrency(monthlyTotal, baseCurrency)}
          sub="per month"
          accent="#A78BFA"
        />
        <StatCard
          label="Yearly Spend"
          value={formatCurrency(yearlyTotal, baseCurrency)}
          sub="per year"
          accent="#60A5FA"
        />
        <StatCard
          label="Daily Spend"
          value={formatCurrency(monthlyTotal / 30, baseCurrency)}
          sub="per day"
          accent="#34D399"
        />
        <StatCard
          label="Subscriptions"
          value={activeSubs.length}
          sub={`${subs.length - activeSubs.length} paused`}
          accent="#F59E0B"
        />
      </div>

      <div className="grid-2-col">
        <SpendByCategory byCategory={byCategory} baseCurrency={baseCurrency} />
        <UpcomingRenewals upcoming={upcoming} openEdit={openEdit} />
      </div>

      <QuickAdd openAdd={openAdd} />
    </div>
  );
}
