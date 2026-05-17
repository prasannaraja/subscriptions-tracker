import type { FamilyCommitment } from "../types";
import { toMonthly, formatCurrencyCode, daysUntil } from "../utils";
import { styles } from "../styles/theme";

const FAMILY_COLOR = "#EC4899";
const currentYear = new Date().getFullYear();
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface FamilyViewProps {
  items: FamilyCommitment[];
  openAdd: () => void;
  openEdit: (item: FamilyCommitment) => void;
  handleDelete: (id: string) => void;
  toggleFamilyMonth: (id: string, monthKey: string) => void;
  toggleFamilyActive: (id: string) => void;
  baseCurrency: string;
}

function ItemRow({
  item,
  showHistory,
  openEdit,
  handleDelete,
  toggleFamilyMonth,
  toggleFamilyActive,
}: {
  item: FamilyCommitment;
  showHistory: boolean;
  openEdit: (i: FamilyCommitment) => void;
  handleDelete: (id: string) => void;
  toggleFamilyMonth: (id: string, key: string) => void;
  toggleFamilyActive: (id: string) => void;
}) {
  const monthly = item.type === "recurring"
    ? toMonthly(item.amount, item.cycle)
    : 0;

  const daysLeft = item.targetDate ? daysUntil(item.targetDate) : null;
  const urgent = daysLeft !== null && daysLeft <= 7;

  return (
    <div style={{ ...styles.subRow, opacity: item.active ? 1 : 0.5 }} className="sub-row-hover">
      <div style={{ ...styles.subIcon, background: item.color || FAMILY_COLOR }}>
        {item.icon || "♡"}
      </div>

      <div style={styles.subInfo}>
        <div style={styles.subName}>{item.name}</div>
        <div style={styles.subMeta}>
          <span style={{ ...styles.catChip, background: FAMILY_COLOR + "22", color: FAMILY_COLOR }}>
            {item.type === "recurring" ? "Recurring" : "One-time"}
          </span>
          {item.type === "recurring" && (
            <>
              <span style={styles.metaSep}>·</span>
              <span style={styles.metaText}>{item.cycle}</span>
            </>
          )}
          {item.type === "onetime" && item.targetDate && (
            <>
              <span style={styles.metaSep}>·</span>
              <span style={styles.metaText}>by {item.targetDate}</span>
            </>
          )}
        </div>

        {/* Monthly history grid for recurring */}
        {showHistory && item.type === "recurring" && item.active && (
          <div className="history-grid-container">
            <div className="history-grid">
              {MONTHS.map((month, idx) => {
                const key = `${currentYear}-${String(idx + 1).padStart(2, "0")}`;
                const isActive = item.history?.[key] ?? false;
                return (
                  <div
                    key={key}
                    className={`history-item ${isActive ? "active" : ""}`}
                    style={isActive ? { background: FAMILY_COLOR, borderColor: FAMILY_COLOR } : {}}
                    onClick={(e) => { e.stopPropagation(); toggleFamilyMonth(item.id, key); }}
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
        {item.type === "recurring" ? (
          <>
            <div style={{ ...styles.subAmt, color: FAMILY_COLOR }}>
              {formatCurrencyCode(item.amount, item.currency)}
              <span style={styles.subCycle}>/{item.cycle === "monthly" ? "mo" : item.cycle === "yearly" ? "yr" : "wk"}</span>
            </div>
            {item.cycle !== "monthly" && (
              <div style={styles.subMonthly}>{formatCurrencyCode(monthly, item.currency)}/mo</div>
            )}
          </>
        ) : (
          <div style={{ ...styles.subAmt, color: FAMILY_COLOR }}>
            {formatCurrencyCode(item.amount, item.currency)}
          </div>
        )}

        {/* Target date badge for one-time */}
        {item.type === "onetime" && daysLeft !== null && item.active && (
          <div style={{
            ...styles.badge,
            background: urgent ? "#EF444422" : "#1E293B",
            color: urgent ? "#EF4444" : "#94A3B8",
            marginTop: 4,
          }}>
            {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : daysLeft < 0 ? "Overdue" : `${daysLeft}d`}
          </div>
        )}
      </div>

      <div style={styles.subActions}>
        {/* Pause/resume for recurring; mark done for one-time */}
        <button
          style={{ ...styles.iconBtn, color: item.active ? "#64748B" : FAMILY_COLOR }}
          title={item.type === "onetime"
            ? (item.active ? "Mark as Done" : "Mark as Pending")
            : (item.active ? "Pause" : "Resume")}
          onClick={() => toggleFamilyActive(item.id)}
        >
          {item.type === "onetime" ? (item.active ? "✓" : "↩") : (item.active ? "⏸" : "▶")}
        </button>
        <button style={styles.iconBtn} title="Edit" onClick={() => openEdit(item)}>✎</button>
        <button
          style={{ ...styles.iconBtn, color: "#EF4444" }}
          title="Delete"
          onClick={() => handleDelete(item.id)}
        >✕</button>
      </div>
    </div>
  );
}

export function FamilyView({
  items,
  openAdd,
  openEdit,
  handleDelete,
  toggleFamilyMonth,
  toggleFamilyActive,
}: FamilyViewProps) {
  const recurring = items.filter((i) => i.type === "recurring" && i.active);
  const onetime = items.filter((i) => i.type === "onetime" && i.active);
  const done = items.filter((i) => !i.active);

  const monthlyByCard = recurring.reduce<Record<string, number>>((acc, i) => {
    const monthly = toMonthly(i.amount, i.cycle);
    acc[i.currency] = (acc[i.currency] ?? 0) + monthly;
    return acc;
  }, {});

  const summaryParts = Object.entries(monthlyByCard).map(
    ([cur, amt]) => `${formatCurrencyCode(amt, cur)}/mo`
  ).join(" + ");

  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Family</h1>
          <p style={styles.pageSubtitle}>
            {recurring.length} recurring · {onetime.length} planned
            {summaryParts && ` · ${summaryParts}`}
          </p>
        </div>
        <button style={styles.primaryBtn} onClick={openAdd}>+ Add</button>
      </div>

      {items.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>♡</div>
          <p>No family commitments yet.</p>
          <button style={styles.primaryBtn} onClick={openAdd}>Add your first one</button>
        </div>
      )}

      {/* Recurring */}
      {recurring.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>Recurring</h2>
          <div style={styles.subList}>
            {recurring.map((item) => (
              <ItemRow key={item.id} item={item} showHistory={true}
                openEdit={openEdit} handleDelete={handleDelete}
                toggleFamilyMonth={toggleFamilyMonth} toggleFamilyActive={toggleFamilyActive} />
            ))}
          </div>
        </div>
      )}

      {/* One-time planned */}
      {onetime.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>Planned Purchases</h2>
          <div style={styles.subList}>
            {onetime.map((item) => (
              <ItemRow key={item.id} item={item} showHistory={false}
                openEdit={openEdit} handleDelete={handleDelete}
                toggleFamilyMonth={toggleFamilyMonth} toggleFamilyActive={toggleFamilyActive} />
            ))}
          </div>
        </div>
      )}

      {/* Done / paused */}
      {done.length > 0 && (
        <div>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>Done / Paused</h2>
          <div style={styles.subList}>
            {done.map((item) => (
              <ItemRow key={item.id} item={item} showHistory={false}
                openEdit={openEdit} handleDelete={handleDelete}
                toggleFamilyMonth={toggleFamilyMonth} toggleFamilyActive={toggleFamilyActive} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
