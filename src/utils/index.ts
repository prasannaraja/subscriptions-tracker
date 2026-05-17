import type { Subscription } from '../types';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function getBillingDays(cycle: string): number {
  if (cycle === "yearly") return 365;
  if (cycle === "weekly") return 7;
  return 30;
}

export function toMonthly(amount: number, cycle: string): number {
  if (cycle === "yearly") return amount / 12;
  if (cycle === "weekly") return amount * 4.33;
  return amount;
}

const LOCALE_CURRENCY_MAP: Record<string, string> = {
  "en-IN": "INR", "hi": "INR", "hi-IN": "INR",
  "en-GB": "GBP",
  "en-CA": "CAD",
  "en-AU": "AUD", "en-NZ": "NZD",
  "en-SG": "SGD",
  "de": "EUR", "fr": "EUR", "it": "EUR", "es": "EUR", "nl": "EUR", "pt-PT": "EUR",
  "de-CH": "CHF", "fr-CH": "CHF", "it-CH": "CHF",
  "ja": "JPY", "ja-JP": "JPY",
};

export function detectLocaleCurrency(): string {
  const locale = navigator.language || "en-US";
  return LOCALE_CURRENCY_MAP[locale] ?? LOCALE_CURRENCY_MAP[locale.split("-")[0]] ?? "USD";
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function getNextBillingDate(startDate: string, cycle: string): string {
  const start = new Date(startDate);
  const today = new Date();
  const days = getBillingDays(cycle);
  while (start <= today) {
    start.setDate(start.getDate() + days);
  }
  return start.toISOString().split("T")[0];
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const STORAGE_KEY = "_subs_v1";

export function loadSubs(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubs(subs: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch {
    // ignore
  }
}
