import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { StoreLayout } from "@/types/store";

import { storeRepository } from "@/repositories/stores/sqliteStoreRepository";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { updateMockStoreLayout } from "@/mocks/stores";

export function useStoreLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      layout,
    }: {
      storeId: number;
      layout: StoreLayout;
    }) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_STORES) {
        const updatedStore = updateMockStoreLayout(storeId, layout);

        if (!updatedStore) {
          throw new Error("Store not found.");
        }

        return updatedStore;
      }

      /**
       * ================================================================
       * REAL LOCAL STORAGE
       * ================================================================
       */

      await storeRepository.updateStoreLayout(storeId, layout);

      return layout;
    },

    onSuccess: (result, variables) => {
      if (USE_MOCK_STORES) {
        queryClient.setQueryData(queryKeys.store(variables.storeId), {
          responseCode: "00",
          responseMessage: "Store retrieved successfully.",
          data: result,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.store(variables.storeId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}
