import { apiClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type { DashboardResponse } from "@/types/dashboard";

export const dashboardService = {
  /**
   * ---------------------------------------------------------------------------
   * Dashboard Summary
   * ---------------------------------------------------------------------------
   *
   * Backend:
   * GET /Store/dashboard
   *
   * Base URL:
   * https://api.myxpresspay.com/api/
   *
   * Authentication:
   * Bearer JWT
   *
   * The current backend documentation defines the response as:
   *
   * data.summary
   * data.stats
   * data.recentTransactions
   */
  async getSummary() {
    const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
      API_ENDPOINTS.dashboard.summary
    );

    return data;
  },
};
