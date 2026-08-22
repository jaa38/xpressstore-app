import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/product-service";

import { queryKeys } from "@/lib/queryKeys";

import type { CreateProductRequest, MerchantProduct } from "@/types/product";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { createMockProduct } from "@/mocks/products";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface CreateProductMutationParams {
  payload: CreateProductRequest;
}

/**
 * ============================================================================
 * CREATE PRODUCT
 * ============================================================================
 */

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * --------------------------------------------------------------------------
     * MUTATION
     * --------------------------------------------------------------------------
     */

    mutationFn: async ({ payload }: CreateProductMutationParams) => {
      /**
       * ========================================================================
       * MOCK MODE
       * ========================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const createdProduct = createMockProduct(payload);

        if (!createdProduct) {
          throw new Error("Unable to create mock product.");
        }

        return {
          responseCode: "00",
          responseMessage: "Product created successfully.",
          data: createdProduct,
        };
      }

      /**
       * ========================================================================
       * API MODE
       * ========================================================================
       */

      return productService.createProduct(payload);
    },

    /**
     * --------------------------------------------------------------------------
     * SUCCESS
     * --------------------------------------------------------------------------
     */

    onSuccess: () => {
      /**
       * Refresh product list.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });
    },
  });
}
