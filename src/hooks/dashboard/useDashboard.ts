import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard/dashboardService";

import { queryKeys } from "@/lib/queryKeys";

import { useAuth } from "@/providers/AuthProvider";

export function useDashboard() {
  const { user } = useAuth();

  const merchantId = user?.merchantDetails?.merchantId;

  const query = useQuery({
    /**
     * ------------------------------------------------------------------------
     * MERCHANT-SCOPED QUERY KEY
     * ------------------------------------------------------------------------
     *
     * Each merchant gets an independent dashboard cache.
     *
     * Merchant A:
     *
     * ["dashboard", "merchant-A"]
     *
     * Merchant B:
     *
     * ["dashboard", "merchant-B"]
     */

    queryKey: merchantId
      ? queryKeys.dashboard(merchantId)
      : ["dashboard", "unauthenticated"],

    /**
     * ------------------------------------------------------------------------
     * QUERY
     * ------------------------------------------------------------------------
     */

    queryFn: () => {
      if (!user) {
        throw new Error("Authenticated merchant is required.");
      }

      return dashboardService.getSummary(user);
    },

    /**
     * ------------------------------------------------------------------------
     * ENABLED
     * ------------------------------------------------------------------------
     *
     * Do not request dashboard data until an authenticated merchant
     * is available.
     */

    enabled: !!user && !!merchantId,
  });

  return {
    dashboard: query.data?.data,

    summary: query.data?.data?.summary,

    stats: query.data?.data?.stats,

    recentTransactions: query.data?.data?.recentTransactions ?? [],

    ...query,
  };
}
