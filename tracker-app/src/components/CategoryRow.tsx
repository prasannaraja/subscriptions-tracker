import { formatCurrency } from '../utils';
import { CATEGORIES } from '../constants';
import { styles } from '../styles/theme';

interface CategoryRowProps {
  categoryKey: string;
  amount: number;
  maxAmount: number;
  baseCurrency: string;
}

export function CategoryRow({ categoryKey, amount, maxAmount, baseCurrency }: CategoryRowProps) {
  const cat = CATEGORIES[categoryKey as keyof typeof CATEGORIES];

  return (
    <div style={styles.catRow}>
      <div style={styles.catLeft}>
        <span style={{ ...styles.catDot, background: cat.color }}>{cat.icon}</span>
        <span style={styles.catName}>{cat.label}</span>
      </div>
      <div style={styles.catBarWrap}>
        <div style={{ ...styles.catBar, width: `${(amount / maxAmount) * 100}%`, background: cat.color }} />
      </div>
      <span style={styles.catAmt}>{formatCurrency(amount, baseCurrency)}</span>
    </div>
  );
}
