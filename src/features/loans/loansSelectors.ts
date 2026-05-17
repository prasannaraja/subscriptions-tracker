import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectLoans = (state: RootState) => state.loans;

export const selectCommittedLoans = createSelector(
  [selectLoans],
  (loans) => loans.filter((l) => l.committed && !l.closed),
);

export const selectOtherCommitmentsByCurrency = createSelector(
  [selectCommittedLoans],
  (committed) =>
    committed.reduce<Record<string, number>>((acc, l) => {
      const monthly = l.planMonths > 0 ? l.totalAmount / l.planMonths : 0;
      acc[l.currency] = (acc[l.currency] ?? 0) + monthly;
      return acc;
    }, {}),
);
