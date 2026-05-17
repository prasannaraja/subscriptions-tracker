import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subscription, SubscriptionForm } from "../../types";
import { generateId } from "../../utils";
import { loadSubscriptions } from "./subscriptionsPersistence";

const initialState: Subscription[] = loadSubscriptions();

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    addSubscription: {
      reducer(state, action: PayloadAction<Subscription>) {
        state.push(action.payload);
      },
      prepare(form: SubscriptionForm) {
        return {
          payload: {
            ...form,
            amount: parseFloat(String(form.amount)),
            id: generateId(),
          },
        };
      },
    },
    deleteSubscription(state, action: PayloadAction<string>) {
      return state.filter((subscription) => subscription.id !== action.payload);
    },
    importSubscriptions(_state, action: PayloadAction<Subscription[]>) {
      return action.payload;
    },
    toggleActive(state, action: PayloadAction<string>) {
      const subscription = state.find((item) => item.id === action.payload);
      if (subscription) {
        subscription.active = !subscription.active;
      }
    },
    toggleMonth(state, action: PayloadAction<{ id: string; monthKey: string }>) {
      const subscription = state.find((item) => item.id === action.payload.id);
      if (!subscription) return;

      const isCurrentlyTracked = subscription.history?.[action.payload.monthKey] ?? false;
      subscription.history = {
        ...subscription.history,
        [action.payload.monthKey]: !isCurrentlyTracked,
      };
    },
    updateSubscription(state, action: PayloadAction<{ id: string; form: SubscriptionForm }>) {
      const index = state.findIndex((subscription) => subscription.id === action.payload.id);
      if (index >= 0) {
        state[index] = {
          ...action.payload.form,
          id: action.payload.id,
        };
      }
    },
  },
});

export const {
  addSubscription,
  deleteSubscription,
  importSubscriptions,
  toggleActive,
  toggleMonth,
  updateSubscription,
} = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
