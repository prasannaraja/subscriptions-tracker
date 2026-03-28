import type { Subscription, Preset } from '../types';
import { CATEGORIES, PRESETS } from '../constants';
import { daysUntil, formatCurrency } from '../utils';
import { styles } from '../styles/theme';

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
  const maxCat = Math.max(...Object.values(byCategory), 0.01);

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
        {[
          { label: 'Monthly Spend', value: formatCurrency(monthlyTotal, baseCurrency), sub: 'per month', accent: '#A78BFA' },
          { label: 'Yearly Spend', value: formatCurrency(yearlyTotal, baseCurrency), sub: 'per year', accent: '#60A5FA' },
          { label: 'Daily Spend', value: formatCurrency(monthlyTotal / 30, baseCurrency), sub: 'per day', accent: '#34D399' },
          { label: 'Subscriptions', value: activeSubs.length, sub: `${subs.length - activeSubs.length} paused`, accent: '#F59E0B' },
        ].map((card) => (
          <div key={card.label} style={styles.statCard}>
            <div style={{ ...styles.statAccent, background: card.accent }} />
            <div style={styles.statLabel}>{card.label}</div>
            <div style={{ ...styles.statValue, color: card.accent }}>{card.value}</div>
            <div style={styles.statSub}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2-col">
        {/* Top Expenses */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Spend by Category</h2>
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const val = byCategory[key] || 0;
            if (val === 0) return null;
            return (
              <div key={key} style={styles.catRow}>
                <div style={styles.catLeft}>
                  <span style={{ ...styles.catDot, background: cat.color }}>{cat.icon}</span>
                  <span style={styles.catName}>{cat.label}</span>
                </div>
                <div style={styles.catBarWrap}>
                  <div style={{ ...styles.catBar, width: `${(val / maxCat) * 100}%`, background: cat.color }} />
                </div>
                <span style={styles.catAmt}>{formatCurrency(val, baseCurrency)}</span>
              </div>
            );
          })}
          {monthlyTotal === 0 && <p style={styles.emptyText}>No active subscriptions yet.</p>}
        </div>

        {/* Upcoming */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Upcoming Renewals</h2>
          {upcoming.length === 0 && <p style={styles.emptyText}>No subscriptions yet.</p>}
          {upcoming.map((s) => {
            const days = daysUntil(s.nextDate);
            const urgent = days <= 3;
            return (
              <div key={s.id} style={styles.upcomingRow} onClick={() => openEdit(s)}>
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
          })}
        </div>
      </div>

      {/* Quick add presets */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Quick Add</h2>
        <div style={styles.presetGrid}>
          {PRESETS.map((p) => (
            <button key={p.name} style={styles.presetBtn} onClick={() => openAdd(p)}>
              <span style={{ ...styles.presetIcon, background: p.color }}>{p.icon}</span>
              <span style={styles.presetName}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
