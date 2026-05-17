import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { toMonthly } from "../../utils";

export const selectFamily = (state: RootState) => state.family;

export const selectActiveRecurring = createSelector(
  [selectFamily],
  (items) => items.filter((i) => i.type === "recurring" && i.active),
);

export const selectPendingOnetime = createSelector(
  [selectFamily],
  (items) => items.filter((i) => i.type === "onetime" && i.active),
);

export const selectFamilyMonthlyByCurrency = createSelector(
  [selectActiveRecurring],
  (recurring) =>
    recurring.reduce<Record<string, number>>((acc, item) => {
      const monthly = toMonthly(item.amount, item.cycle);
      acc[item.currency] = (acc[item.currency] ?? 0) + monthly;
      return acc;
    }, {}),
);
