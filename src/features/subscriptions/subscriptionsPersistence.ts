import type { Subscription } from "../../types";
import seedSubscriptions from "./seedSubscriptions.json";
import { normalizeSubscriptions } from "./subscriptionsValidation";

const STORAGE_KEY = "_subs_v1";
const normalizedSeedSubscriptions = normalizeSubscriptions(seedSubscriptions) ?? [];

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizedSeedSubscriptions;

    const subscriptions = normalizeSubscriptions(JSON.parse(raw));
    return subscriptions ?? normalizedSeedSubscriptions;
  } catch {
    return normalizedSeedSubscriptions;
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch {
    // localStorage can fail in private mode or when quota is exceeded.
  }
}
