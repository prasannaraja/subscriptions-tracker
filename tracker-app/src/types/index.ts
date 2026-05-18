export interface Subscription {
  id: string;
  name: string;
  amount: number | string;
  currency: string;
  cycle: string;
  category: string;
  startDate: string;
  notes: string;
  color: string;
  icon: string;
  active: boolean;
  url?: string;
  history?: Record<string, boolean>;
}

export type SubscriptionForm = Omit<Subscription, "id">;

export interface Category {
  label: string;
  icon: string;
  color: string;
}

export interface Preset {
  name: string;
  category: string;
  color: string;
  icon: string;
}

export interface ToastMessage {
  msg: string;
  type: "success" | "error" | "info";
}
