import type { Subscription, Preset } from '../types';
import { CATEGORIES } from '../constants';
import { getNextBillingDate, daysUntil, toMonthly, formatCurrency } from '../utils';
import { styles } from '../styles/theme';

interface ListViewProps {
  filteredSubs: Subscription[];
  filterCat: string;
  setFilterCat: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  searchQ: string;
  setSearchQ: (val: string) => void;
  showInactive: boolean;
  setShowInactive: (val: boolean) => void;
  openAdd: (preset?: Preset) => void;
  openEdit: (sub: Subscription) => void;
  handleDelete: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleMonth: (id: string, monthKey: string) => void;
}

export function ListView({
  filteredSubs,
  filterCat,
  setFilterCat,
  sortBy,
  setSortBy,
  searchQ,
  setSearchQ,
  showInactive,
  setShowInactive,
  openAdd,
  openEdit,
  handleDelete,
  toggleActive,
  toggleMonth,
}: ListViewProps) {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Subscriptions</h1>
          <p style={styles.pageSubtitle}>{filteredSubs.length} shown</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => openAdd()}>
          + Add New
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        <select style={styles.select} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="amount">Sort: Amount</option>
          <option value="next">Sort: Next Renewal</option>
        </select>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Show paused
        </label>
      </div>

      {filteredSubs.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>◈</div>
          <p>No subscriptions found.</p>
          <button style={styles.primaryBtn} onClick={() => openAdd()}>
            Add your first one
          </button>
        </div>
      )}

      <div style={styles.subList}>
        {filteredSubs.map((s) => {
          const nextDate = getNextBillingDate(s.startDate, s.cycle);
          const days = daysUntil(nextDate);
          const monthly = toMonthly(parseFloat(String(s.amount)) || 0, s.cycle);
          const cat = CATEGORIES[s.category] || CATEGORIES.other;

          return (
            <div key={s.id} style={{ ...styles.subRow, opacity: s.active ? 1 : 0.5 }} className="sub-row-hover">
              <div style={{ ...styles.subIcon, background: s.color || cat.color }}>{s.icon || cat.icon}</div>
              <div style={styles.subInfo}>
                <div style={styles.subName}>
                  {s.url ? (
                    <a
                      href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#E2E8F0', textDecoration: 'none' }}
                      onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {s.name} <span style={{ fontSize: 10, color: '#64748B', marginLeft: 4 }}>↗</span>
                    </a>
                  ) : (
                    s.name
                  )}
                </div>
                <div style={styles.subMeta}>
                  <span style={{ ...styles.catChip, background: cat.color + '22', color: cat.color }}>
                    {cat.label}
                  </span>
                  <span style={styles.metaSep}>·</span>
                  <span style={styles.metaText}>
                    Renews {nextDate} ({days}d)
                  </span>
                </div>
                
                {/* Year Tracker Grid */}
                {s.active && (
                  <div className="history-grid-container">
                    <div className="history-grid">
                      {months.map((month, idx) => {
                        const monthNum = String(idx + 1).padStart(2, '0');
                        const key = `${currentYear}-${monthNum}`;
                        const isActive = s.history?.[key] ?? false;
                        return (
                          <div 
                            key={key} 
                            className={`history-item ${isActive ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleMonth(s.id, key); }}
                            title={`${month} ${currentYear}`}
                          >
                            {month.charAt(0)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div style={styles.subRight}>
                <div style={styles.subAmt}>
                  {formatCurrency(parseFloat(String(s.amount)), s.currency)}
                  <span style={styles.subCycle}>
                    /{s.cycle === 'monthly' ? 'mo' : s.cycle === 'yearly' ? 'yr' : 'wk'}
                  </span>
                </div>
                {s.cycle !== 'monthly' && <div style={styles.subMonthly}>{formatCurrency(monthly, s.currency)}/mo</div>}
              </div>
              <div style={styles.subActions}>
                <button
                  style={styles.iconBtn}
                  title={s.active ? 'Pause' : 'Resume'}
                  onClick={() => toggleActive(s.id)}
                >
                  {s.active ? '⏸' : '▶'}
                </button>
                <button style={styles.iconBtn} title="Edit" onClick={() => openEdit(s)}>
                  ✎
                </button>
                <button
                  style={{ ...styles.iconBtn, color: '#EF4444' }}
                  title="Delete"
                  onClick={() => handleDelete(s.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
