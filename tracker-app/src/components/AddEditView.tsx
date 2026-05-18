import { CATEGORIES, CURRENCIES, BILLING_CYCLES } from '../constants';
import { toMonthly, formatCurrency } from '../utils';
import { styles } from '../styles/theme';
import type { SubscriptionForm } from '../types';

interface AddEditViewProps {
  form: SubscriptionForm;
  setForm: React.Dispatch<React.SetStateAction<SubscriptionForm>>;
  editId: string | null;
  handleSave: () => void;
  onCancel: () => void;
}

export function AddEditView({ form, setForm, editId, handleSave, onCancel }: AddEditViewProps) {
  function set(key: keyof SubscriptionForm, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="page-container">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>{editId ? 'Edit Subscription' : 'Add Subscription'}</h1>
      </div>

      <div style={{ ...styles.card, maxWidth: 560 }}>
        {/* Icon & Color preview */}
        <div style={styles.formPreview}>
          <div style={{ ...styles.subIconLg, background: form.color }}>{form.icon || '◎'}</div>
          <div style={{ flex: 1 }}>
            <div style={styles.formRow}>
              <label style={styles.label}>Icon character</label>
              <input
                style={styles.input}
                value={form.icon}
                maxLength={3}
                onChange={(e) => set('icon', e.target.value)}
                placeholder="◎"
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Accent color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  style={{ ...styles.input, width: 48, padding: 2, cursor: 'pointer' }}
                />
                {['#FF6B6B', '#A78BFA', '#34D399', '#60A5FA', '#F59E0B', '#EC4899', '#14B8A6'].map((c) => (
                  <div
                    key={c}
                    onClick={() => set('color', c)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: c,
                      cursor: 'pointer',
                      border: form.color === c ? '2px solid white' : '2px solid transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Name *</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Netflix"
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Service URL (Optional)</label>
          <input
            style={styles.input}
            value={form.url || ''}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://netflix.com/account"
            type="url"
          />
        </div>

        <div className="grid-form">
          <div style={styles.formRow}>
            <label style={styles.label}>Amount *</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="9.99"
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Currency</label>
            <select style={styles.select} value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formRow}>
            <label style={styles.label}>Billing Cycle</label>
            <select style={styles.select} value={form.cycle} onChange={(e) => set('cycle', e.target.value)}>
              {BILLING_CYCLES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Category</label>
            <select style={styles.select} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Start / First Billing Date</label>
          <input
            style={styles.input}
            type="date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Notes</label>
          <textarea
            style={{ ...styles.input, minHeight: 70, resize: 'vertical' } as React.CSSProperties}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Optional notes..."
          />
        </div>

        {form.amount && !isNaN(parseFloat(String(form.amount))) && (
          <div style={styles.calcPreview}>
            <span>
              ≈ <strong>{formatCurrency(toMonthly(parseFloat(String(form.amount)), form.cycle), form.currency)}</strong>/month ·{' '}
              <strong>{formatCurrency(toMonthly(parseFloat(String(form.amount)), form.cycle) * 12, form.currency)}</strong>/year
            </span>
          </div>
        )}

        <div style={styles.formActions}>
          <button style={styles.ghostBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.primaryBtn} onClick={handleSave}>
            {editId ? 'Save Changes' : 'Add Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
