import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { getMockStores } from "@/mocks/stores";

export function useStores() {
  const query = useQuery({
    queryKey: queryKeys.stores,

    queryFn: async () => {
      if (USE_MOCK_STORES) {
        return {
          responseCode: "00",
          responseMessage: "Stores retrieved successfully.",
          data: getMockStores(),
        };
      }

      return storeService.getStores();
    },
  });

  return {
    stores: query.data?.data ?? [],

    isLoading: query.isLoading,

    isRefetching: query.isRefetching,

    error: query.error,

    refetch: query.refetch,
  };
}
