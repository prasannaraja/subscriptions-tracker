import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadSettings } from "./settingsPersistence";

interface SettingsState {
  baseCurrency: string;
}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBaseCurrency(state, action: PayloadAction<string>) {
      state.baseCurrency = action.payload;
    },
  },
});

export const { setBaseCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;
