import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "@/features/services/dashboard-service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}