import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard/dashboardService";

import { queryKeys } from "@/lib/queryKeys";

export function useDashboard() {
  const query = useQuery({
    queryKey: queryKeys.dashboard,

    queryFn: dashboardService.getSummary,
  });

  return {
    dashboard: query.data?.data,

    summary: query.data?.data?.summary,

    stats: query.data?.data?.stats,

    recentTransactions: query.data?.data?.recentTransactions ?? [],

    ...query,
  };
}
