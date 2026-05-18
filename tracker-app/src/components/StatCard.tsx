import { styles } from '../styles/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statAccent, background: accent }} />
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: accent }}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}
