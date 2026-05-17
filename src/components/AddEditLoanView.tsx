import { useState } from "react";
import { CURRENCIES } from "../constants";
import { formatCurrency } from "../utils";
import { styles } from "../styles/theme";
import type { LoanForm } from "../types";

const COLORS = ["#FB923C", "#A78BFA", "#60A5FA", "#34D399", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];

interface AddEditLoanViewProps {
  form: LoanForm;
  setForm: React.Dispatch<React.SetStateAction<LoanForm>>;
  editId: string | null;
  handleSave: () => void;
  onCancel: () => void;
}

export function AddEditLoanView({ form, setForm, editId, handleSave, onCancel }: AddEditLoanViewProps) {
  const [planMonthsInput, setPlanMonthsInput] = useState(String(form.planMonths || 12));

  function set<K extends keyof LoanForm>(key: K, val: LoanForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const monthly = form.totalAmount && form.planMonths > 0
    ? parseFloat(String(form.totalAmount)) / form.planMonths
    : 0;

  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>{editId ? "Edit Loan" : "Add Loan"}</h1>
      </div>

      <div style={{ ...styles.card, maxWidth: 560 }}>
        {/* Icon & Color */}
        <div style={styles.formPreview}>
          <div style={{ ...styles.subIconLg, background: form.color }}>{form.icon || "◎"}</div>
          <div style={{ flex: 1 }}>
            <div style={styles.formRow}>
              <label style={styles.label}>Icon Character</label>
              <input
                style={styles.input}
                maxLength={3}
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>Accent Color</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => set("color", c)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, background: c, cursor: "pointer",
                      outline: form.color === c ? `2px solid ${c}` : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>Name *</label>
          <input
            style={styles.input}
            placeholder="e.g. HDFC Personal Loan"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        {/* Amount + Currency */}
        <div style={{ ...styles.formRow, display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Total Amount *</label>
            <input
              style={styles.input}
              type="number"
              placeholder="60000"
              value={form.totalAmount || ""}
              onChange={(e) => set("totalAmount", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label style={styles.label}>Currency</label>
            <select style={styles.select} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Received Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>Received Date *</label>
          <input
            style={styles.input}
            type="date"
            value={form.receivedDate}
            onChange={(e) => set("receivedDate", e.target.value)}
          />
        </div>

        {/* Notes */}
        <div style={styles.formRow}>
          <label style={styles.label}>Notes</label>
          <textarea
            style={{ ...styles.input, minHeight: 72, resize: "vertical" }}
            placeholder="Optional notes..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        {/* Commitment Plan */}
        <div style={{ borderTop: "1px solid #1E293B", paddingTop: 16, marginTop: 4 }}>
          <label style={{ ...styles.toggleLabel, marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={form.committed}
              onChange={(e) => set("committed", e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: "#E2E8F0", fontWeight: 600 }}>Start repayment plan</span>
          </label>

          {form.committed && (
            <>
              <div style={styles.formRow}>
                <label style={styles.label}>Plan Duration (months)</label>
                <input
                  style={styles.input}
                  type="number"
                  min={1}
                  max={360}
                  value={planMonthsInput}
                  onChange={(e) => {
                    setPlanMonthsInput(e.target.value);
                    const n = parseInt(e.target.value);
                    if (n >= 1 && n <= 360) set("planMonths", n);
                  }}
                />
              </div>
              {monthly > 0 && (
                <div style={styles.calcPreview}>
                  ≈ <strong>{formatCurrency(monthly, form.currency)}</strong>/month to set aside ·{" "}
                  <strong>{formatCurrency(parseFloat(String(form.totalAmount)), form.currency)}</strong> total over {form.planMonths} months
                </div>
              )}
            </>
          )}
        </div>

        <div style={styles.formActions}>
          <button style={styles.ghostBtn} onClick={onCancel}>Cancel</button>
          <button style={styles.primaryBtn} onClick={handleSave}>
            {editId ? "Save Changes" : "Add Loan"}
          </button>
        </div>
      </div>
    </div>
  );
}
