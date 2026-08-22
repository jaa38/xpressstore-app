import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/product-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { addMockProductToStore } from "@/mocks/stores";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface AddProductToStoreVariables {
  productId: number;

  storeIds: number[];
}

/**
 * ============================================================================
 * ADD PRODUCT TO STORE
 * ============================================================================
 */

export function useAddProductToStore() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * --------------------------------------------------------------------------
     * MUTATION
     * --------------------------------------------------------------------------
     */

    mutationFn: async ({ productId, storeIds }: AddProductToStoreVariables) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        /**
         * Add the product to every selected store.
         */

        for (const storeId of storeIds) {
          const updatedStore = addMockProductToStore(storeId, productId);

          if (!updatedStore) {
            throw new Error(`Store ${storeId} could not be found.`);
          }
        }

        return {
          responseCode: "00",

          responseMessage: "Product added to store successfully.",

          data: undefined,
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       */

      return productService.addProductToStore({
        productId,

        storeIds,
      });
    },

    /**
     * --------------------------------------------------------------------------
     * SUCCESS
     * --------------------------------------------------------------------------
     */

    onSuccess: (_data, variables) => {
      /**
       * Refresh product data.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      /**
       * Refresh the store list.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      /**
       * Refresh each individual store.
       */

      for (const storeId of variables.storeIds) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.store(storeId),
        });
      }
    },
  });
}
