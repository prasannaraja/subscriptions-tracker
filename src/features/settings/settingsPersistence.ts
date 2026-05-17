import { detectLocaleCurrency } from "../../utils";

const STORAGE_KEY = "_settings_v1";

export interface PersistedSettings {
  baseCurrency: string;
}

export function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.baseCurrency === "string") return parsed;
    }
  } catch {
    // fall through to default
  }
  return { baseCurrency: detectLocaleCurrency() };
}

export function saveSettings(settings: PersistedSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage can fail in private mode or when quota is exceeded
  }
}
