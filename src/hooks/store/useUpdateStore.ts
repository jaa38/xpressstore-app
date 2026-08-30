import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { updateMockStore } from "@/mocks/stores";

import type { Store, UpdateStoreRequest } from "@/types/store";

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
       * --------------------------------------------------------------------------
       * UPDATE STORE LIST CACHE
       * --------------------------------------------------------------------------
       *
       * The update endpoint returns void, so use the values from the
       * successful request to update the cached store list.
       */

      queryClient.setQueryData(
        queryKeys.stores,
        (
          current:
            | {
                responseCode: string;
                responseMessage: string;
                data: Store[];
              }
            | undefined
        ) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            data: current.data.map((store) =>
              store.storeId === variables.id
                ? {
                    ...store,
                    isActive: variables.isActive,
                  }
                : store
            ),
          };
        }
      );

      /**
       * --------------------------------------------------------------------------
       * UPDATE INDIVIDUAL STORE CACHE
       * --------------------------------------------------------------------------
       */

      queryClient.setQueryData(
        queryKeys.store(variables.id),
        (
          current:
            | {
                responseCode: string;
                responseMessage: string;
                data: Store;
              }
            | undefined
        ) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            data: {
              ...current.data,
              isActive: variables.isActive,
            },
          };
        }
      );

      /**
       * --------------------------------------------------------------------------
       * REFETCH FROM API
       * --------------------------------------------------------------------------
       *
       * Keep the server as the final source of truth.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.store(variables.id),
      });
    },
  });
}
