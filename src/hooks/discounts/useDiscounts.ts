import { useQuery } from "@tanstack/react-query";

import { getDiscounts } from "@/services/discount/discount-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_DISCOUNTS } from "@/mocks/config";
import { getMockDiscounts } from "@/mocks/discounts";

/**
 * ============================================================================
 * USE DISCOUNTS
 * ============================================================================
 */

export function useDiscounts() {
  const query = useQuery({
    queryKey: queryKeys.discounts,

    queryFn: async () => {
      if (USE_MOCK_DISCOUNTS) {
        return getMockDiscounts();
      }

      return getDiscounts();
    },
  });

  return {
    data: query.data ?? [],

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isRefetching: query.isRefetching,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}
