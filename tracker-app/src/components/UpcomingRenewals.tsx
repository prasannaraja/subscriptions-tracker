import type { Subscription } from '../types';
import { RenewalRow } from './RenewalRow';
import { styles } from '../styles/theme';

interface UpcomingRenewalsProps {
  upcoming: (Subscription & { nextDate: string })[];
  openEdit: (sub: Subscription) => void;
}

export function UpcomingRenewals({ upcoming, openEdit }: UpcomingRenewalsProps) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Upcoming Renewals</h2>
      {upcoming.length === 0 && <p style={styles.emptyText}>No subscriptions yet.</p>}
      {upcoming.map((s) => (
        <RenewalRow
          key={s.id}
          subscription={s}
          openEdit={openEdit}
        />
      ))}
    </div>
  );
}
