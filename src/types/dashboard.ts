/**
 * ============================================================================
 * Dashboard API Models
 * ============================================================================
 *
 * Source:
 * storefrontDocumentation.txt
 *
 * Endpoint:
 * GET /Store/dashboard
 * ============================================================================
 */

export interface DashboardSummary {
  totalRevenue: number;

  totalTransactions: number;

  pendingSettlements: number;

  revenueChangeValue: number;

  revenueTrend: string | null;

  revenueChangePercent: number;

  transactionsChangeValue: number;

  transactionsTrend: string | null;

  transactionsChangePercent: number;

  settlementsChangeValue: number;

  settlementsTrend: string | null;

  settlementsChangePercent: number;
}

export interface DashboardStats {
  orders: number;

  productsSold: number;

  newCustomers: number;
}

export interface DashboardRecentTransaction {
  customerName: string | null;

  transactionType: string | null;

  amount: number;

  transactionDate: string | null;

  referenceNo: string | null;
}

export interface DashboardResponse {
  summary: DashboardSummary;

  stats: DashboardStats;

  recentTransactions: DashboardRecentTransaction[] | null;
}