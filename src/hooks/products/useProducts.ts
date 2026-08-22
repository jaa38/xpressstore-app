import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/product-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { getMockProducts } from "@/mocks/products";

/**
 * ============================================================================
 * USE PRODUCTS
 * ============================================================================
 */

export function useProducts() {
  const query = useQuery({
    queryKey: queryKeys.products,

    queryFn: async () => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        return {
          responseCode: "00",

          responseMessage: "Products retrieved successfully.",

          data: getMockProducts(),
        };
      }

      /**
       * ================================================================
       * REAL API
       * ================================================================
       */

      return productService.getMerchantProducts();
    },
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
