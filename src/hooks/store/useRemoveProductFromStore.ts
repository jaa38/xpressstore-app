import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { removeMockProductFromStore } from "@/mocks/stores";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface RemoveProductFromStoreVariables {
  productId: number;

  storeId: number;
}

/**
 * ============================================================================
 * REMOVE PRODUCT FROM STORE
 * ============================================================================
 */

export function useRemoveProductFromStore() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * --------------------------------------------------------------------------
     * MUTATION
     * --------------------------------------------------------------------------
     */

    mutationFn: async ({
      productId,
      storeId,
    }: RemoveProductFromStoreVariables) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const updatedStore = removeMockProductFromStore(storeId, productId);

        if (!updatedStore) {
          throw new Error(`Store ${storeId} could not be found.`);
        }

        return {
          responseCode: "00",

          responseMessage: "Product removed from store successfully.",

          data: updatedStore,
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       *
       * The current product service does not expose a documented
       * remove-product-from-store endpoint.
       *
       * Do not silently pretend that the API removal succeeded.
       */

      throw new Error(
        "Removing products from a store is not currently supported by the API."
      );
    },

    /**
     * --------------------------------------------------------------------------
     * SUCCESS
     * --------------------------------------------------------------------------
     */

    onSuccess: (_data, variables) => {
      /**
       * Refresh stores.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      /**
       * Refresh the individual store.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.store(variables.storeId),
      });

      /**
       * Refresh products.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });
    },
  });
}
