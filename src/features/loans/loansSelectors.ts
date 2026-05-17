import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectLoans = (state: RootState) => state.loans;

export const selectCommittedLoans = createSelector(
  [selectLoans],
  (loans) => loans.filter((l) => l.committed && !l.closed),
);

export const selectOtherCommitmentsMonthly = createSelector(
  [selectCommittedLoans],
  (committed) =>
    committed.reduce((sum, l) => sum + (l.planMonths > 0 ? l.totalAmount / l.planMonths : 0), 0),
);
