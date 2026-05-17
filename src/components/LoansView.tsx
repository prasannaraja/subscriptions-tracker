import type { Loan } from "../types";
import { formatCurrency } from "../utils";
import { styles } from "../styles/theme";

interface LoansViewProps {
  loans: Loan[];
  openAdd: () => void;
  openEdit: (loan: Loan) => void;
  handleDelete: (id: string) => void;
  toggleLoanMonth: (id: string, monthKey: string) => void;
  handleStartPlan: (id: string, planMonths: number) => void;
  handleClose: (id: string) => void;
  baseCurrency: string;
}

const ACCENT = "#FB923C";
const currentYear = new Date().getFullYear();
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function loanStats(loan: Loan) {
  const monthly = loan.planMonths > 0 ? loan.totalAmount / loan.planMonths : 0;
  const monthsSaved = Object.values(loan.history).filter(Boolean).length;
  const amountSaved = monthsSaved * monthly;
  const progress = loan.planMonths > 0 ? Math.min(monthsSaved / loan.planMonths, 1) : 0;
  return { monthly, monthsSaved, amountSaved, progress };
}

function LoanRow({
  loan,
  showHistory,
  showClose,
  showStartPlan,
  openEdit,
  handleDelete,
  toggleLoanMonth,
  handleStartPlan,
  handleClose,
}: {
  loan: Loan;
  showHistory: boolean;
  showClose: boolean;
  showStartPlan: boolean;
  openEdit: (l: Loan) => void;
  handleDelete: (id: string) => void;
  toggleLoanMonth: (id: string, key: string) => void;
  handleStartPlan: (id: string, months: number) => void;
  handleClose: (id: string) => void;
}) {
  const { monthly, monthsSaved, amountSaved, progress } = loanStats(loan);

  function onStartPlan() {
    const input = window.prompt("Set aside over how many months?", "12");
    if (!input) return;
    const n = parseInt(input);
    if (n >= 1 && n <= 360) handleStartPlan(loan.id, n);
  }

  return (
    <div style={{ ...styles.subRow, opacity: loan.closed ? 0.5 : 1 }} className="sub-row-hover">
      <div style={{ ...styles.subIcon, background: loan.color || ACCENT }}>{loan.icon || "◎"}</div>

      <div style={styles.subInfo}>
        <div style={styles.subName}>{loan.name}</div>
        <div style={styles.subMeta}>
          <span style={{ ...styles.catChip, background: ACCENT + "22", color: ACCENT }}>Loan</span>
          <span style={styles.metaSep}>·</span>
          <span style={styles.metaText}>
            {loan.committed
              ? `${monthsSaved}/${loan.planMonths} months · ${formatCurrency(amountSaved, loan.currency)} saved`
              : "No plan set"}
          </span>
        </div>

        {/* Progress bar */}
        {loan.committed && (
          <div style={{ ...styles.catBarWrap, marginTop: 8, height: 4 }}>
            <div style={{ ...styles.catBar, width: `${progress * 100}%`, background: ACCENT }} />
          </div>
        )}

        {/* Monthly history grid */}
        {showHistory && (
          <div className="history-grid-container">
            <div className="history-grid">
              {MONTHS.map((month, idx) => {
                const key = `${currentYear}-${String(idx + 1).padStart(2, "0")}`;
                const isActive = loan.history?.[key] ?? false;
                return (
                  <div
                    key={key}
                    className={`history-item ${isActive ? "active" : ""}`}
                    style={isActive ? { background: ACCENT, borderColor: ACCENT } : {}}
                    onClick={(e) => { e.stopPropagation(); toggleLoanMonth(loan.id, key); }}
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
        <div style={{ ...styles.subAmt, color: ACCENT }}>
          {formatCurrency(loan.totalAmount, loan.currency)}
        </div>
        {loan.committed && (
          <div style={styles.subMonthly}>{formatCurrency(monthly, loan.currency)}/mo</div>
        )}
      </div>

      <div style={styles.subActions}>
        {showStartPlan && (
          <button style={{ ...styles.iconBtn, color: ACCENT }} title="Start Plan" onClick={onStartPlan}>▶</button>
        )}
        {showClose && (
          <button
            style={{ ...styles.iconBtn, color: "#10B981" }}
            title="Mark as Repaid & Close"
            onClick={() => { if (window.confirm(`Mark "${loan.name}" as repaid and close it?`)) handleClose(loan.id); }}
          >✓</button>
        )}
        <button style={styles.iconBtn} title="Edit" onClick={() => openEdit(loan)}>✎</button>
        <button
          style={{ ...styles.iconBtn, color: "#EF4444" }}
          title="Delete"
          onClick={() => handleDelete(loan.id)}
        >✕</button>
      </div>
    </div>
  );
}

export function LoansView({
  loans,
  openAdd,
  openEdit,
  handleDelete,
  toggleLoanMonth,
  handleStartPlan,
  handleClose,
  baseCurrency,
}: LoansViewProps) {
  const committed = loans.filter((l) => l.committed && !l.closed);
  const notCommitted = loans.filter((l) => !l.committed && !l.closed);
  const closed = loans.filter((l) => l.closed);

  const totalMonthly = committed.reduce(
    (sum, l) => sum + (l.planMonths > 0 ? l.totalAmount / l.planMonths : 0),
    0,
  );

  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Loans</h1>
          <p style={styles.pageSubtitle}>
            {committed.length} active plan{committed.length !== 1 ? "s" : ""}
            {totalMonthly > 0 && ` · ${formatCurrency(totalMonthly, baseCurrency)}/month set aside`}
          </p>
        </div>
        <button style={styles.primaryBtn} onClick={openAdd}>+ Add Loan</button>
      </div>

      {loans.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>◎</div>
          <p>No loans recorded yet.</p>
          <button style={styles.primaryBtn} onClick={openAdd}>Add your first loan</button>
        </div>
      )}

      {/* Committed */}
      {committed.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>Active Plans</h2>
          <div style={styles.subList}>
            {committed.map((loan) => (
              <LoanRow
                key={loan.id}
                loan={loan}
                showHistory={true}
                showClose={true}
                showStartPlan={false}
                openEdit={openEdit}
                handleDelete={handleDelete}
                toggleLoanMonth={toggleLoanMonth}
                handleStartPlan={handleStartPlan}
                handleClose={handleClose}
              />
            ))}
          </div>
        </div>
      )}

      {/* Not committed */}
      {notCommitted.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>No Plan Yet</h2>
          <div style={styles.subList}>
            {notCommitted.map((loan) => (
              <LoanRow
                key={loan.id}
                loan={loan}
                showHistory={false}
                showClose={false}
                showStartPlan={true}
                openEdit={openEdit}
                handleDelete={handleDelete}
                toggleLoanMonth={toggleLoanMonth}
                handleStartPlan={handleStartPlan}
                handleClose={handleClose}
              />
            ))}
          </div>
        </div>
      )}

      {/* Closed */}
      {closed.length > 0 && (
        <div>
          <h2 style={{ ...styles.cardTitle, marginBottom: 12 }}>Closed / Repaid</h2>
          <div style={styles.subList}>
            {closed.map((loan) => (
              <LoanRow
                key={loan.id}
                loan={loan}
                showHistory={false}
                showClose={false}
                showStartPlan={false}
                openEdit={openEdit}
                handleDelete={handleDelete}
                toggleLoanMonth={toggleLoanMonth}
                handleStartPlan={handleStartPlan}
                handleClose={handleClose}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
