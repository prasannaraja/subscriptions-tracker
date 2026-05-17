import type { Subscription } from "../../types";
import seedSubscriptions from "./seedSubscriptions.json";

const STORAGE_KEY = "_subs_v1";

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedSubscriptions;
  } catch {
    return seedSubscriptions;
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch {
    // localStorage can fail in private mode or when quota is exceeded.
  }
}
