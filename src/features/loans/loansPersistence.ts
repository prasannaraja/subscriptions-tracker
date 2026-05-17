import type { Loan } from "../../types";
import { normalizeLoans } from "./loansValidation";

const STORAGE_KEY = "_loans_v1";

export function loadLoans(): Loan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeLoans(JSON.parse(raw)) ?? [];
  } catch {
    return [];
  }
}

export function saveLoans(loans: Loan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  } catch {
    // localStorage can fail in private mode or when quota is exceeded
  }
}
