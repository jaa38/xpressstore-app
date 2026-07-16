import type { Currency } from "@/types/product";

export interface DashboardStats {
  currency: Currency;

  todayRevenue: number;
  weekRevenue: number;

  growth: number;

  orders: number;

  newCustomers: number;
}
