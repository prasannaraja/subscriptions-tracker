import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Loan, LoanForm } from "../../types";
import { generateId } from "../../utils";
import { loadLoans } from "./loansPersistence";

const initialState: Loan[] = loadLoans();

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    addLoan: {
      reducer(state, action: PayloadAction<Loan>) {
        state.push(action.payload);
      },
      prepare(form: LoanForm) {
        return {
          payload: {
            ...form,
            totalAmount: parseFloat(String(form.totalAmount)),
            id: generateId(),
          },
        };
      },
    },
    deleteLoan(state, action: PayloadAction<string>) {
      return state.filter((loan) => loan.id !== action.payload);
    },
    updateLoan(state, action: PayloadAction<{ id: string; form: LoanForm }>) {
      const index = state.findIndex((loan) => loan.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...action.payload.form, id: action.payload.id };
      }
    },
    toggleLoanMonth(state, action: PayloadAction<{ id: string; monthKey: string }>) {
      const loan = state.find((l) => l.id === action.payload.id);
      if (!loan) return;
      const current = loan.history?.[action.payload.monthKey] ?? false;
      loan.history = { ...loan.history, [action.payload.monthKey]: !current };
    },
    setCommitted(state, action: PayloadAction<{ id: string; committed: boolean; planMonths?: number }>) {
      const loan = state.find((l) => l.id === action.payload.id);
      if (!loan) return;
      loan.committed = action.payload.committed;
      if (action.payload.planMonths !== undefined) loan.planMonths = action.payload.planMonths;
    },
    closeLoan(state, action: PayloadAction<string>) {
      const loan = state.find((l) => l.id === action.payload);
      if (loan) loan.closed = true;
    },
  },
});

export const { addLoan, deleteLoan, updateLoan, toggleLoanMonth, setCommitted, closeLoan } =
  loansSlice.actions;
export default loansSlice.reducer;
