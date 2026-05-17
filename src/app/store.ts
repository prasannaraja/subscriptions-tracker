import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";
import settingsReducer from "../features/settings/settingsSlice";
import toastReducer from "../features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    subscriptions: subscriptionsReducer,
    settings: settingsReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
