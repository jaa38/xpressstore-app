import { apiClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type { DashboardResponse } from "@/types/dashboard";

import type { AuthUser } from "@/types/auth";

import { USE_MOCK_DASHBOARD } from "@/mocks/config";

import { getMockDashboard } from "@/mocks";

export const dashboardService = {
  /**
   * ---------------------------------------------------------------------------
   * Dashboard Summary
   * ---------------------------------------------------------------------------
   */

  async getSummary(user?: AuthUser) {
    /**
     * -------------------------------------------------------------------------
     * MOCK
     * -------------------------------------------------------------------------
     */

    if (USE_MOCK_DASHBOARD) {
      if (!user) {
        throw new Error(
          "Authenticated merchant is required for mock dashboard."
        );
      }

      const dashboard = getMockDashboard(user);

      return {
        responseCode: "00",

        responseMessage: "Dashboard loaded successfully",

        data: {
          summary: dashboard.summary,

          stats: undefined,

          recentTransactions: [],
        },
      };
    }

    /**
     * -------------------------------------------------------------------------
     * REAL API
     * -------------------------------------------------------------------------
     */

    const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
      API_ENDPOINTS.dashboard.summary
    );

    return data;
  },
};
