import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { getMockProductsByStore } from "@/mocks/products";

/**
 * ============================================================================
 * USE STORE PRODUCTS
 * ============================================================================
 *
 * Retrieves the products assigned to a specific store.
 *
 * MOCK MODE
 * ----------
 * Uses getMockProductsByStore().
 *
 * REAL API
 * --------
 * Uses productService.getProductsByStore().
 * ============================================================================
 */

export function useStoreProducts(storeId?: number) {
  const query = useQuery({
    queryKey: queryKeys.productsByStore(storeId as number),

    queryFn: async () => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        return {
          responseCode: "00",

          responseMessage: "Store products retrieved successfully.",

          data: getMockProductsByStore(storeId as number),
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       */

      return productService.getProductsByStore(storeId as number);
    },

    enabled: !!storeId,
  });

  return {
    products: query.data?.data ?? [],

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isRefetching: query.isRefetching,

    error: query.error,

    refetch: query.refetch,
  };
}
