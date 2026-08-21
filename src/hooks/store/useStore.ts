import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { getMockStore } from "@/mocks/stores";

interface Props {
  storeId: number;
}

export function useStore({ storeId }: Props) {
  const query = useQuery({
    queryKey: queryKeys.store(storeId),

    queryFn: async () => {
      /**
       * ================================================================
       * MOCK STORE
       * ================================================================
       */

      if (USE_MOCK_STORES) {
        const store = getMockStore(storeId);

        if (!store) {
          throw new Error("Store not found");
        }

        return {
          responseCode: "00",
          responseMessage: "Store retrieved successfully",
          data: store,
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       */

      return storeService.getStore(storeId);
    },

    enabled: Number.isFinite(storeId) && storeId > 0,
  });

  return {
    store: query.data?.data,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    error: query.error,

    refetch: query.refetch,
  };
}
