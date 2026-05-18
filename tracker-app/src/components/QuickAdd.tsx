import type { Preset } from '../types';
import { PRESETS } from '../constants';
import { styles } from '../styles/theme';

interface QuickAddProps {
  openAdd: (preset?: Preset) => void;
}

export function QuickAdd({ openAdd }: QuickAddProps) {
  return (
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
  );
}
