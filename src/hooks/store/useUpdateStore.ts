import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { updateMockStore } from "@/mocks/stores";

import type { UpdateStoreRequest } from "@/types/store";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStoreRequest) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_STORES) {
        const updatedStore = updateMockStore(payload.id, payload);

        if (!updatedStore) {
          throw new Error("Store not found.");
        }

        return {
          responseCode: "00",
          responseMessage: "Store updated successfully.",
          data: updatedStore,
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       */

      return storeService.updateStore(payload);
    },

    onSuccess: (_data, variables) => {
      /**
       * Refresh the store list.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      /**
       * Refresh the individual store.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.store(variables.id),
      });
    },
  });
}
