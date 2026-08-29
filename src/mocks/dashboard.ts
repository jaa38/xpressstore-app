import type { AuthUser } from "@/types/auth";

import type { DashboardResponse } from "@/types/dashboard";

/**
 * ============================================================================
 * MOCK DASHBOARD
 * ============================================================================
 *
 * Dashboard data is isolated by merchant ID.
 *
 * Each merchant gets their own dashboard state.
 *
 * Example:
 *
 * merchant-001
 * merchant-002
 * merchant-003
 *
 * These merchants never share dashboard state.
 * ============================================================================
 */

interface MockDashboardState {
  summary: {
    totalRevenue: number;

    totalTransactions: number;

    pendingSettlements: number;

    revenueChangePercent: number;
  };
}

/**
 * ---------------------------------------------------------------------------
 * Default dashboard
 * ---------------------------------------------------------------------------
 *
 * Used when a merchant has no dashboard state yet.
 * ---------------------------------------------------------------------------
 */

function createDefaultDashboard(): MockDashboardState {
  return {
    summary: {
      totalRevenue: 0,

      totalTransactions: 0,

      pendingSettlements: 0,

      revenueChangePercent: 0,
    },
  };
}

/**
 * ---------------------------------------------------------------------------
 * Merchant dashboard database
 * ---------------------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * This is keyed by merchant ID.
 *
 * Do NOT create one global dashboard object.
 * ---------------------------------------------------------------------------
 */

const MOCK_DASHBOARDS: Record<string, MockDashboardState> = {};

/**
 * ---------------------------------------------------------------------------
 * Get merchant dashboard
 * ---------------------------------------------------------------------------
 */

export function getMockDashboard(user: AuthUser): MockDashboardState {
  const merchantId = user.merchantDetails?.merchantId;

  if (!merchantId) {
    throw new Error("Cannot load mock dashboard without a merchant ID.");
  }

  if (!MOCK_DASHBOARDS[merchantId]) {
    MOCK_DASHBOARDS[merchantId] = createDefaultDashboard();
  }

  return {
    summary: {
      ...MOCK_DASHBOARDS[merchantId].summary,
    },
  };
}

/**
 * ---------------------------------------------------------------------------
 * Update dashboard business name
 * ---------------------------------------------------------------------------
 *
 * Kept as a dashboard-level mock helper for compatibility.
 *
 * Business identity itself should ultimately live in the merchant profile.
 * ---------------------------------------------------------------------------
 */

export function updateMockDashboardBusinessName(
  user: AuthUser,
  businessName: string
) {
  const merchantId = user.merchantDetails?.merchantId;

  if (!merchantId) {
    throw new Error("Cannot update mock dashboard without a merchant ID.");
  }

  /**
   * Dashboard data currently does not store businessName.
   *
   * The merchant profile is responsible for that value.
   *
   * This function intentionally ensures the merchant exists in the mock
   * dashboard database without sharing state with another merchant.
   */

  if (!MOCK_DASHBOARDS[merchantId]) {
    MOCK_DASHBOARDS[merchantId] = createDefaultDashboard();
  }

  return getMockDashboard(user);
}

/**
 * ---------------------------------------------------------------------------
 * Reset merchant dashboard
 * ---------------------------------------------------------------------------
 */

export function resetMockDashboard(user: AuthUser) {
  const merchantId = user.merchantDetails?.merchantId;

  if (!merchantId) {
    return;
  }

  delete MOCK_DASHBOARDS[merchantId];
}

/**
 * ---------------------------------------------------------------------------
 * Seed dashboard
 * ---------------------------------------------------------------------------
 *
 * Useful if you want a specific merchant to have demo data.
 * ---------------------------------------------------------------------------
 */

export function seedMockDashboard(
  user: AuthUser,
  dashboard: MockDashboardState
) {
  const merchantId = user.merchantDetails?.merchantId;

  if (!merchantId) {
    throw new Error("Cannot seed mock dashboard without a merchant ID.");
  }

  MOCK_DASHBOARDS[merchantId] = {
    summary: {
      ...dashboard.summary,
    },
  };
}
