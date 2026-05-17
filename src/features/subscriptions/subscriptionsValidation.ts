import { BILLING_CYCLES, CATEGORIES, CURRENCIES } from "../../constants";
import type { Subscription } from "../../types";
import { generateId } from "../../utils";

const FALLBACK_COLOR = "#94A3B8";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function normalizeHistory(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, boolean>>((history, [key, isTracked]) => {
    if (MONTH_KEY_PATTERN.test(key) && typeof isTracked === "boolean") {
      history[key] = isTracked;
    }
    return history;
  }, {});
}

export function normalizeSubscription(value: unknown): Subscription | null {
  if (!isRecord(value)) return null;

  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (typeof value.name !== "string" || !value.name.trim()) return null;
  if (!isValidDate(value.startDate)) return null;

  const cycle = typeof value.cycle === "string" && BILLING_CYCLES.includes(value.cycle)
    ? value.cycle
    : "monthly";
  const category = typeof value.category === "string" && value.category in CATEGORIES
    ? value.category
    : "other";
  const currency = typeof value.currency === "string" && CURRENCIES.includes(value.currency)
    ? value.currency
    : "USD";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : generateId(),
    name: value.name.trim(),
    amount,
    currency,
    cycle,
    category,
    startDate: value.startDate,
    notes: typeof value.notes === "string" ? value.notes : "",
    color: isValidHexColor(value.color) ? value.color : FALLBACK_COLOR,
    icon: typeof value.icon === "string" && value.icon.trim() ? value.icon.slice(0, 3) : "◎",
    active: typeof value.active === "boolean" ? value.active : true,
    url: typeof value.url === "string" ? value.url : "",
    history: normalizeHistory(value.history),
    contractEndDate: isValidDate(value.contractEndDate) ? value.contractEndDate as string : undefined,
    cancellationNote: typeof value.cancellationNote === "string" ? value.cancellationNote : undefined,
  };
}

export function normalizeSubscriptions(value: unknown): Subscription[] | null {
  if (!Array.isArray(value)) return null;

  const subscriptions = value
    .map((item) => normalizeSubscription(item))
    .filter((item): item is Subscription => item !== null);

  return subscriptions.length === value.length ? subscriptions : null;
}
