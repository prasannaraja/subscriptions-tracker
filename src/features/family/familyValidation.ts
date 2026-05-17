import { BILLING_CYCLES, CURRENCIES } from "../../constants";
import type { FamilyCommitment } from "../../types";
import { generateId } from "../../utils";

const FALLBACK_COLOR = "#EC4899";
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
  return Object.entries(value).reduce<Record<string, boolean>>((acc, [key, val]) => {
    if (MONTH_KEY_PATTERN.test(key) && typeof val === "boolean") acc[key] = val;
    return acc;
  }, {});
}

export function normalizeFamilyItem(value: unknown): FamilyCommitment | null {
  if (!isRecord(value)) return null;

  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (typeof value.name !== "string" || !value.name.trim()) return null;

  const type = value.type === "onetime" ? "onetime" : "recurring";
  const targetDate = type === "onetime" && isValidDate(value.targetDate)
    ? (value.targetDate as string)
    : "";

  const cycle = typeof value.cycle === "string" && BILLING_CYCLES.includes(value.cycle)
    ? value.cycle
    : "monthly";

  const currency = typeof value.currency === "string" && CURRENCIES.includes(value.currency)
    ? value.currency
    : "EUR";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : generateId(),
    name: (value.name as string).trim(),
    type,
    amount,
    currency,
    cycle,
    targetDate,
    notes: typeof value.notes === "string" ? value.notes : "",
    color: isValidHexColor(value.color) ? value.color as string : FALLBACK_COLOR,
    icon: typeof value.icon === "string" && (value.icon as string).trim()
      ? (value.icon as string).slice(0, 3)
      : "♡",
    active: typeof value.active === "boolean" ? value.active : true,
    history: normalizeHistory(value.history),
  };
}

export function normalizeFamily(value: unknown): FamilyCommitment[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map(normalizeFamilyItem).filter((i): i is FamilyCommitment => i !== null);
  return items.length === value.length ? items : null;
}
