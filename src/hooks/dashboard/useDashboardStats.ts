import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard/dashboardService";

import { queryKeys } from "@/lib/queryKeys";

export function useDashboardStats(merchantId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(merchantId),

    queryFn: () => dashboardService.getSummary(),

    enabled: Boolean(merchantId),
  });
}
