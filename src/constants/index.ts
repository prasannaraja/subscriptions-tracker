import type { Category, Preset } from '../types';

export const CATEGORIES: Record<string, Category> = {
  streaming: { label: "Streaming", icon: "▶", color: "#FF6B6B" },
  ai: { label: "AI & Productivity", icon: "✦", color: "#A78BFA" },
  utilities: { label: "Utilities", icon: "⚡", color: "#34D399" },
  mobile: { label: "Mobile & Internet", icon: "◈", color: "#60A5FA" },
  software: { label: "Software & Dev", icon: "⌘", color: "#F59E0B" },
  other: { label: "Other", icon: "◉", color: "#94A3B8" },
};

export const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "CAD", "AUD"];

export const PRESETS: Preset[] = [
  { name: "Netflix", category: "streaming", color: "#E50914", icon: "N" },
  { name: "Spotify", category: "streaming", color: "#1DB954", icon: "♪" },
  { name: "Disney+", category: "streaming", color: "#113CCF", icon: "✦" },
  { name: "ChatGPT Plus", category: "ai", color: "#10A37F", icon: "◎" },
  { name: "GitHub Copilot", category: "software", color: "#6E40C9", icon: "⌥" },
  { name: "Gemini Pro", category: "ai", color: "#4285F4", icon: "◈" },
  { name: "Claude Pro", category: "ai", color: "#D97706", icon: "✧" },
  { name: "Adobe CC", category: "software", color: "#FF0000", icon: "Ai" },
  { name: "Microsoft 365", category: "software", color: "#0078D4", icon: "⊞" },
  { name: "iCloud+", category: "utilities", color: "#147EFB", icon: "☁" },
];

export const BILLING_CYCLES = ["monthly", "yearly", "weekly"];

export const EMPTY_FORM = {
  name: "",
  amount: "",
  currency: "USD",
  cycle: "monthly",
  category: "streaming",
  startDate: new Date().toISOString().split("T")[0],
  notes: "",
  color: "#A78BFA",
  icon: "◎",
  active: true,
  url: "",
  history: {},
};
