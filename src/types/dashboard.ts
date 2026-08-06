import type { Currency } from "@/types/currency";

export interface DashboardSummary {
  todayRevenue: number;

  totalRevenue: number;

  totalTransactions: number;

  pendingTransactions: number;

  successfulTransactions: number;

  failedTransactions: number;

  growth: number;

  currency: Currency;
}