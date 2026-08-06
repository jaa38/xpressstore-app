import { authClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type { DashboardSummary } from "@/types/dashboard";

export const dashboardService = {
  /**
   * ---------------------------------------------------------------------------
   * Dashboard Summary
   * ---------------------------------------------------------------------------
   */
  async getSummary() {
    const { data } =
      await authClient.get<ApiResponse<DashboardSummary>>(
        API_ENDPOINTS.dashboard.summary
      );

    return data;
  },
};