import type { Subscription } from '../types';
import { daysUntil, formatCurrency } from '../utils';
import { styles } from '../styles/theme';

interface RenewalRowProps {
  subscription: Subscription & { nextDate: string };
  openEdit: (sub: Subscription) => void;
}

export function RenewalRow({ subscription: s, openEdit }: RenewalRowProps) {
  const days = daysUntil(s.nextDate);
  const urgent = days <= 3;

  return (
    <div style={styles.upcomingRow} onClick={() => openEdit(s)}>
      <div style={{ ...styles.subIcon, background: s.color || '#A78BFA' }}>{s.icon || '◎'}</div>
      <div style={styles.upcomingInfo}>
        <span style={styles.upcomingName}>
          {s.url ? (
            <a
              href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E2E8F0', textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
              onClick={(e) => e.stopPropagation()}
            >
              {s.name} <span style={{ fontSize: 10, color: '#64748B', marginLeft: 4 }}>↗</span>
            </a>
          ) : (
            s.name
          )}
        </span>
        <span style={styles.upcomingDate}>{s.nextDate}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            ...styles.badge,
            background: urgent ? '#EF444422' : '#1E293B',
            color: urgent ? '#EF4444' : '#94A3B8',
          }}
        >
          {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days}d`}
        </div>
        <div style={styles.upcomingAmt}>{formatCurrency(parseFloat(String(s.amount)), s.currency)}</div>
      </div>
    </div>
  );
}
