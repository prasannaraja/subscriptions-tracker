import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getNextBillingDate, toMonthly } from "../../utils";

export const selectSubscriptions = (state: RootState) => state.subscriptions;
export const selectFilters = (state: RootState) => state.filters;

export const selectActiveSubscriptions = createSelector(
  [selectSubscriptions],
  (subscriptions) => subscriptions.filter((subscription) => subscription.active),
);

export const selectMonthlyTotal = createSelector(
  [selectActiveSubscriptions],
  (activeSubscriptions) =>
    activeSubscriptions.reduce(
      (sum, subscription) => sum + toMonthly(parseFloat(String(subscription.amount)) || 0, subscription.cycle),
      0,
    ),
);

export const selectYearlyTotal = createSelector([selectMonthlyTotal], (monthlyTotal) => monthlyTotal * 12);

export const selectSubscriptionsByCategory = createSelector(
  [selectActiveSubscriptions],
  (activeSubscriptions) => {
    const byCategory: Record<string, number> = {};
    activeSubscriptions.forEach((subscription) => {
      if (!byCategory[subscription.category]) byCategory[subscription.category] = 0;
      byCategory[subscription.category] += toMonthly(parseFloat(String(subscription.amount)) || 0, subscription.cycle);
    });
    return byCategory;
  },
);

export const selectUpcomingRenewals = createSelector(
  [selectActiveSubscriptions],
  (activeSubscriptions) =>
    activeSubscriptions
      .map((subscription) => ({
        ...subscription,
        nextDate: getNextBillingDate(subscription.startDate, subscription.cycle),
      }))
      .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
      .slice(0, 5),
);

export const selectBaseCurrency = createSelector(
  [selectActiveSubscriptions],
  (activeSubscriptions) => activeSubscriptions[0]?.currency || "USD",
);

export const selectFilteredSubscriptions = createSelector(
  [selectSubscriptions, selectActiveSubscriptions, selectFilters],
  (subscriptions, activeSubscriptions, filters) => {
    let list = filters.showInactive ? subscriptions : activeSubscriptions;
    if (filters.filterCat !== "all") {
      list = list.filter((subscription) => subscription.category === filters.filterCat);
    }
    if (filters.searchQ) {
      list = list.filter((subscription) =>
        subscription.name.toLowerCase().includes(filters.searchQ.toLowerCase()),
      );
    }

    return [...list].sort((a, b) => {
      if (filters.sortBy === "name") return a.name.localeCompare(b.name);
      if (filters.sortBy === "amount") {
        return toMonthly(parseFloat(String(b.amount)) || 0, b.cycle) -
          toMonthly(parseFloat(String(a.amount)) || 0, a.cycle);
      }
      if (filters.sortBy === "next") {
        return new Date(getNextBillingDate(a.startDate, a.cycle)).getTime() -
          new Date(getNextBillingDate(b.startDate, b.cycle)).getTime();
      }
      return 0;
    });
  },
);
