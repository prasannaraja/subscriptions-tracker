import type { Subscription, Preset, Loan, FamilyCommitment } from '../types';
import { CATEGORIES, PRESETS } from '../constants';
import { daysUntil, formatCurrency, formatCurrencyCode } from '../utils';
import { styles } from '../styles/theme';

const COMMITMENT_COLOR = "#FB923C";
const FAMILY_COLOR = "#EC4899";

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
  committedLoans: Loan[];
  otherCommitmentsByCurrency: Record<string, number>;
  onOpenLoans: () => void;
  familyMonthlyByCurrency: Record<string, number>;
  pendingOnetime: FamilyCommitment[];
  onOpenFamily: () => void;
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
  committedLoans,
  otherCommitmentsByCurrency,
  onOpenLoans,
  familyMonthlyByCurrency,
  pendingOnetime,
  onOpenFamily,
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
        {Object.entries(otherCommitmentsByCurrency).map(([currency, monthly]) => (
          <div key={`commitment-${currency}`} style={styles.statCard}>
            <div style={{ ...styles.statAccent, background: COMMITMENT_COLOR }} />
            <div style={styles.statLabel}>Commitments · {currency}</div>
            <div style={{ ...styles.statValue, color: COMMITMENT_COLOR }}>{formatCurrencyCode(monthly, currency)}</div>
            <div style={styles.statSub}>per month</div>
          </div>
        ))}
        {Object.entries(familyMonthlyByCurrency).map(([currency, monthly]) => (
          <div key={`family-${currency}`} style={styles.statCard}>
            <div style={{ ...styles.statAccent, background: FAMILY_COLOR }} />
            <div style={styles.statLabel}>Family · {currency}</div>
            <div style={{ ...styles.statValue, color: FAMILY_COLOR }}>{formatCurrencyCode(monthly, currency)}</div>
            <div style={styles.statSub}>per month</div>
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
          {Object.entries(otherCommitmentsByCurrency).map(([currency, monthly]) => (
            <div key={`cat-commitment-${currency}`} style={styles.catRow}>
              <div style={styles.catLeft}>
                <span style={{ ...styles.catDot, background: COMMITMENT_COLOR }}>◎</span>
                <span style={styles.catName}>Commitments ({currency})</span>
              </div>
              <div style={styles.catBarWrap}>
                <div style={{ ...styles.catBar, width: `${Math.min((monthly / maxCat) * 100, 100)}%`, background: COMMITMENT_COLOR }} />
              </div>
              <span style={styles.catAmt}>{formatCurrencyCode(monthly, currency)}</span>
            </div>
          ))}
          {Object.entries(familyMonthlyByCurrency).map(([currency, monthly]) => (
            <div key={`cat-family-${currency}`} style={styles.catRow}>
              <div style={styles.catLeft}>
                <span style={{ ...styles.catDot, background: FAMILY_COLOR }}>♡</span>
                <span style={styles.catName}>Family ({currency})</span>
              </div>
              <div style={styles.catBarWrap}>
                <div style={{ ...styles.catBar, width: `${Math.min((monthly / maxCat) * 100, 100)}%`, background: FAMILY_COLOR }} />
              </div>
              <span style={styles.catAmt}>{formatCurrencyCode(monthly, currency)}</span>
            </div>
          ))}
          {monthlyTotal === 0 && Object.keys(otherCommitmentsByCurrency).length === 0 && Object.keys(familyMonthlyByCurrency).length === 0 && (
            <p style={styles.emptyText}>No active subscriptions yet.</p>
          )}
        </div>

        {/* Loan Commitments */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Loan Commitments</h2>
          {committedLoans.length === 0 && <p style={styles.emptyText}>No active loan plans.</p>}
          {committedLoans.map((loan) => {
            const monthly = loan.planMonths > 0 ? loan.totalAmount / loan.planMonths : 0;
            const monthsSaved = Object.values(loan.history).filter(Boolean).length;
            const progress = loan.planMonths > 0 ? Math.min(monthsSaved / loan.planMonths, 1) : 0;
            return (
              <div key={loan.id} style={styles.upcomingRow} onClick={onOpenLoans}>
                <div style={{ ...styles.subIcon, background: loan.color || COMMITMENT_COLOR }}>{loan.icon || '◎'}</div>
                <div style={styles.upcomingInfo}>
                  <span style={styles.upcomingName}>{loan.name}</span>
                  <div style={{ ...styles.catBarWrap, marginTop: 4 }}>
                    <div style={{ ...styles.catBar, width: `${progress * 100}%`, background: COMMITMENT_COLOR }} />
                  </div>
                  <span style={styles.upcomingDate}>{monthsSaved}/{loan.planMonths} months saved</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...styles.badge, background: COMMITMENT_COLOR + '22', color: COMMITMENT_COLOR }}>
                    {formatCurrencyCode(monthly, loan.currency)}/mo
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Planned Purchases */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Planned Purchases</h2>
          {pendingOnetime.length === 0 && <p style={styles.emptyText}>No planned purchases.</p>}
          {pendingOnetime.map((item) => {
            const daysLeft = item.targetDate ? daysUntil(item.targetDate) : null;
            const urgent = daysLeft !== null && daysLeft <= 7;
            return (
              <div key={item.id} style={styles.upcomingRow} onClick={onOpenFamily}>
                <div style={{ ...styles.subIcon, background: item.color || FAMILY_COLOR }}>{item.icon || "♡"}</div>
                <div style={styles.upcomingInfo}>
                  <span style={styles.upcomingName}>{item.name}</span>
                  <span style={styles.upcomingDate}>{item.targetDate || "No date set"}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  {daysLeft !== null && (
                    <div style={{
                      ...styles.badge,
                      background: urgent ? "#EF444422" : "#1E293B",
                      color: urgent ? "#EF4444" : "#94A3B8",
                    }}>
                      {daysLeft === 0 ? "Today!" : daysLeft < 0 ? "Overdue" : `${daysLeft}d`}
                    </div>
                  )}
                  <div style={styles.upcomingAmt}>{formatCurrencyCode(item.amount, item.currency)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Upcoming Renewals</h2>
          {upcoming.length === 0 && <p style={styles.emptyText}>No subscriptions yet.</p>}
          {upcoming.map((s) => {
            const isContract = !!s.contractEndDate;
            const displayDate = isContract ? s.contractEndDate! : s.nextDate;
            const days = daysUntil(displayDate);
            const urgent = days <= 3;
            const expiringSOon = isContract && days <= 30;
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
                  <span style={styles.upcomingDate}>
                    {isContract ? `Contract expires ${displayDate}` : displayDate}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    ...styles.badge,
                    background: (urgent || expiringSOon) ? '#EF444422' : '#1E293B',
                    color: (urgent || expiringSOon) ? '#EF4444' : '#94A3B8',
                  }}>
                    {isContract ? `Expires ${days}d` : (days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days}d`)}
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
