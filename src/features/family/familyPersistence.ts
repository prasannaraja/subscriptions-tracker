import type { FamilyCommitment } from "../../types";
import { normalizeFamily } from "./familyValidation";

const STORAGE_KEY = "_family_v1";

export function loadFamily(): FamilyCommitment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeFamily(JSON.parse(raw)) ?? [];
  } catch {
    return [];
  }
}

export function saveFamily(items: FamilyCommitment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage can fail in private mode or when quota is exceeded
  }
}
