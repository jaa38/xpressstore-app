import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard/dashboardService";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: dashboardService.getSummary,
  });
}