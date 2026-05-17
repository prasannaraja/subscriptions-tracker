import { CURRENCIES } from "../../constants";
import type { Loan } from "../../types";
import { generateId } from "../../utils";

const FALLBACK_COLOR = "#FB923C";
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

export function normalizeLoan(value: unknown): Loan | null {
  if (!isRecord(value)) return null;

  const totalAmount = Number(value.totalAmount);
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return null;
  if (typeof value.name !== "string" || !value.name.trim()) return null;
  if (!isValidDate(value.receivedDate)) return null;

  const planMonths = Number(value.planMonths);
  const validPlanMonths = Number.isInteger(planMonths) && planMonths >= 1 && planMonths <= 360
    ? planMonths
    : 12;

  const currency = typeof value.currency === "string" && CURRENCIES.includes(value.currency)
    ? value.currency
    : "USD";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : generateId(),
    name: (value.name as string).trim(),
    totalAmount,
    currency,
    receivedDate: value.receivedDate as string,
    notes: typeof value.notes === "string" ? value.notes : "",
    color: isValidHexColor(value.color) ? value.color as string : FALLBACK_COLOR,
    icon: typeof value.icon === "string" && (value.icon as string).trim() ? (value.icon as string).slice(0, 3) : "◎",
    committed: typeof value.committed === "boolean" ? value.committed : false,
    planMonths: validPlanMonths,
    history: normalizeHistory(value.history),
    closed: typeof value.closed === "boolean" ? value.closed : false,
  };
}

export function normalizeLoans(value: unknown): Loan[] | null {
  if (!Array.isArray(value)) return null;
  const loans = value.map(normalizeLoan).filter((l): l is Loan => l !== null);
  return loans.length === value.length ? loans : null;
}
