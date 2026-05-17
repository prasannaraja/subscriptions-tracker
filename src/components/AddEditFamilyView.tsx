import { BILLING_CYCLES, CURRENCIES } from "../constants";
import { toMonthly, formatCurrencyCode } from "../utils";
import { styles } from "../styles/theme";
import type { FamilyCommitmentForm } from "../types";

const COLORS = ["#EC4899", "#A78BFA", "#60A5FA", "#34D399", "#FB923C", "#F59E0B", "#EF4444", "#06B6D4"];
const FAMILY_COLOR = "#EC4899";

interface AddEditFamilyViewProps {
  form: FamilyCommitmentForm;
  setForm: React.Dispatch<React.SetStateAction<FamilyCommitmentForm>>;
  editId: string | null;
  handleSave: () => void;
  onCancel: () => void;
}

export function AddEditFamilyView({ form, setForm, editId, handleSave, onCancel }: AddEditFamilyViewProps) {
  function set<K extends keyof FamilyCommitmentForm>(key: K, val: FamilyCommitmentForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const monthly = form.amount > 0
    ? toMonthly(parseFloat(String(form.amount)), form.cycle)
    : 0;

  const tabStyle = (active: boolean) => ({
    flex: 1, padding: "8px 0", border: "none", borderRadius: 7, cursor: "pointer",
    fontSize: 13, fontFamily: "'Sora'", fontWeight: 600,
    background: active ? FAMILY_COLOR : "transparent",
    color: active ? "#fff" : "#64748B",
    transition: "all 0.15s",
  });

  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>{editId ? "Edit Family Commitment" : "Add Family Commitment"}</h1>
      </div>

      <div style={{ ...styles.card, maxWidth: 560 }}>
        {/* Type toggle */}
        <div style={{ display: "flex", gap: 4, background: "#080C14", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          <button style={tabStyle(form.type === "recurring")} onClick={() => set("type", "recurring")}>
            ↻ Recurring
          </button>
          <button style={tabStyle(form.type === "onetime")} onClick={() => set("type", "onetime")}>
            ◈ One-time
          </button>
        </div>

        {/* Icon & Color */}
        <div style={styles.formPreview}>
          <div style={{ ...styles.subIconLg, background: form.color }}>{form.icon || "♡"}</div>
          <div style={{ flex: 1 }}>
            <div style={styles.formRow}>
              <label style={styles.label}>Icon Character</label>
              <input style={styles.input} maxLength={3} value={form.icon}
                onChange={(e) => set("icon", e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Accent Color</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <div key={c} onClick={() => set("color", c)} style={{
                    width: 22, height: 22, borderRadius: 6, background: c, cursor: "pointer",
                    outline: form.color === c ? `2px solid ${c}` : "none", outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>Name *</label>
          <input style={styles.input}
            placeholder={form.type === "recurring" ? "e.g. Piano Class" : "e.g. Wife's Spectacles"}
            value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        {/* Amount + Currency */}
        <div style={{ ...styles.formRow, display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Amount *</label>
            <input style={styles.input} type="number" placeholder="95"
              value={form.amount || ""}
              onChange={(e) => set("amount", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label style={styles.label}>Currency</label>
            <select style={styles.select} value={form.currency}
              onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Recurring-only: cycle + calc preview */}
        {form.type === "recurring" && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>Billing Cycle</label>
              <select style={styles.select} value={form.cycle}
                onChange={(e) => set("cycle", e.target.value)}>
                {BILLING_CYCLES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            {monthly > 0 && form.cycle !== "monthly" && (
              <div style={styles.calcPreview}>
                ≈ <strong>{formatCurrencyCode(monthly, form.currency)}</strong>/month
              </div>
            )}
          </>
        )}

        {/* One-time-only: target date */}
        {form.type === "onetime" && (
          <div style={styles.formRow}>
            <label style={styles.label}>Target Date (optional)</label>
            <input style={styles.input} type="date" value={form.targetDate}
              onChange={(e) => set("targetDate", e.target.value)} />
          </div>
        )}

        {/* Notes */}
        <div style={styles.formRow}>
          <label style={styles.label}>Notes</label>
          <textarea style={{ ...styles.input, minHeight: 64, resize: "vertical" }}
            placeholder="Optional notes..."
            value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <div style={styles.formActions}>
          <button style={styles.ghostBtn} onClick={onCancel}>Cancel</button>
          <button style={styles.primaryBtn} onClick={handleSave}>
            {editId ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
