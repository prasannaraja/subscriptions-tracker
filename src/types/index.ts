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
  contractEndDate?: string;
  cancellationNote?: string;
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

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  currency: string;
  receivedDate: string;
  notes: string;
  color: string;
  icon: string;
  committed: boolean;
  planMonths: number;
  history: Record<string, boolean>;
  closed: boolean;
}

export type LoanForm = Omit<Loan, "id">;

export interface FamilyCommitment {
  id: string;
  name: string;
  type: "recurring" | "onetime";
  amount: number;
  currency: string;
  cycle: string;
  targetDate: string;
  notes: string;
  color: string;
  icon: string;
  active: boolean;
  history: Record<string, boolean>;
}

export type FamilyCommitmentForm = Omit<FamilyCommitment, "id">;
