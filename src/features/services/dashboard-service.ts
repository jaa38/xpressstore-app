import type { DashboardStats } from "@/features/dashboard/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    currency: "NGN",

    todayRevenue: 48250,

    weekRevenue: 312400,

    growth: 24,

    orders: 38,

    newCustomers: 12,
  };
}