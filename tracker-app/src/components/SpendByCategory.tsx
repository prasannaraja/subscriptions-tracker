import { CATEGORIES } from '../constants';
import { CategoryRow } from './CategoryRow';
import { styles } from '../styles/theme';

interface SpendByCategoryProps {
  byCategory: Record<string, number>;
  baseCurrency: string;
}

export function SpendByCategory({ byCategory, baseCurrency }: SpendByCategoryProps) {
  const maxCat = Math.max(...Object.values(byCategory), 0.01);
  const monthlyTotal = Object.values(byCategory).reduce((a, b) => a + b, 0);

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Spend by Category</h2>
      {Object.entries(CATEGORIES).map(([key]) => {
        const val = byCategory[key] || 0;
        if (val === 0) return null;
        return (
          <CategoryRow
            key={key}
            categoryKey={key}
            amount={val}
            maxAmount={maxCat}
            baseCurrency={baseCurrency}
          />
        );
      })}
      {monthlyTotal === 0 && <p style={styles.emptyText}>No active subscriptions yet.</p>}
    </div>
  );
}
