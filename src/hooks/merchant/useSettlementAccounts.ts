import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { queryKeys } from "@/lib/queryKeys";

/**
 * ============================================================================
 * SETTLEMENT ACCOUNTS
 * ============================================================================
 */

export const SETTLEMENT_ACCOUNTS_QUERY_KEY = queryKeys.settlementAccounts;

/**
 * ============================================================================
 * QUERY
 * ============================================================================
 */

export function useSettlementAccounts() {
  const query = useQuery({
    queryKey: SETTLEMENT_ACCOUNTS_QUERY_KEY,

    queryFn: merchantService.getSettlementAccounts,

    /**
     * Keep settlement account data stable while navigating.
     */
    staleTime: 1000 * 60,
  });

  return {
    settlementAccounts: query.data?.data ?? [],

    isLoading: query.isLoading,

    isRefetching: query.isRefetching,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}
