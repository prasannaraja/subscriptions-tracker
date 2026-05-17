import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FamilyCommitment, FamilyCommitmentForm } from "../../types";
import { generateId } from "../../utils";
import { loadFamily } from "./familyPersistence";

const initialState: FamilyCommitment[] = loadFamily();

const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {
    addFamilyItem: {
      reducer(state, action: PayloadAction<FamilyCommitment>) {
        state.push(action.payload);
      },
      prepare(form: FamilyCommitmentForm) {
        return {
          payload: {
            ...form,
            amount: parseFloat(String(form.amount)),
            id: generateId(),
          },
        };
      },
    },
    deleteFamilyItem(state, action: PayloadAction<string>) {
      return state.filter((item) => item.id !== action.payload);
    },
    updateFamilyItem(state, action: PayloadAction<{ id: string; form: FamilyCommitmentForm }>) {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...action.payload.form, id: action.payload.id };
      }
    },
    toggleFamilyMonth(state, action: PayloadAction<{ id: string; monthKey: string }>) {
      const item = state.find((i) => i.id === action.payload.id);
      if (!item) return;
      const current = item.history?.[action.payload.monthKey] ?? false;
      item.history = { ...item.history, [action.payload.monthKey]: !current };
    },
    toggleFamilyActive(state, action: PayloadAction<string>) {
      const item = state.find((i) => i.id === action.payload);
      if (item) item.active = !item.active;
    },
  },
});

export const {
  addFamilyItem,
  deleteFamilyItem,
  updateFamilyItem,
  toggleFamilyMonth,
  toggleFamilyActive,
} = familySlice.actions;
export default familySlice.reducer;
