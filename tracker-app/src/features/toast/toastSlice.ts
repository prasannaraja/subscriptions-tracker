import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ToastMessage } from "../../types";

const toastSlice = createSlice({
  name: "toast",
  initialState: null as ToastMessage | null,
  reducers: {
    showToast(_state, action: PayloadAction<ToastMessage>) {
      return action.payload;
    },
    clearToast() {
      return null;
    },
  },
});

export const { clearToast, showToast } = toastSlice.actions;
export default toastSlice.reducer;
