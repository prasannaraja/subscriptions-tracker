import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import familyReducer from "../features/family/familySlice";
import loansReducer from "../features/loans/loansSlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";
import settingsReducer from "../features/settings/settingsSlice";
import toastReducer from "../features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    family: familyReducer,
    loans: loansReducer,
    subscriptions: subscriptionsReducer,
    settings: settingsReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
