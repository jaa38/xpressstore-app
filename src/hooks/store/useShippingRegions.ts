import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { getMockShippingRegions } from "@/mocks/stores";

export function useShippingRegions() {
  const query = useQuery({
    queryKey: queryKeys.shippingRegions,

    queryFn: async () => {
      if (USE_MOCK_STORES) {
        return {
          responseCode: "00",
          responseMessage: "Shipping regions retrieved successfully.",
          data: getMockShippingRegions(),
        };
      }

      return storeService.getShippingRegions();
    },
  });

  return {
    shippingRegions: query.data?.data ?? [],

    isLoading: query.isLoading,

    isRefetching: query.isRefetching,

    error: query.error,

    refetch: query.refetch,
  };
}
