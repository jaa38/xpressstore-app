import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/product-service";

import { queryKeys } from "@/lib/queryKeys";

import type { MerchantProduct, UpdateProductRequest } from "@/types/product";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { updateMockProduct } from "@/mocks/products";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface UpdateProductMutationParams {
  productId: number;
  payload: UpdateProductRequest;
}

/**
 * ============================================================================
 * UPDATE PRODUCT
 * ============================================================================
 */

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * --------------------------------------------------------------------------
     * MUTATION
     * --------------------------------------------------------------------------
     */

    mutationFn: async ({ productId, payload }: UpdateProductMutationParams) => {
      /**
       * ========================================================================
       * MOCK MODE
       * ========================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const updatedProduct = updateMockProduct(productId, {
          ...payload,

          currency: payload.currency as MerchantProduct["currency"],
        });

        if (!updatedProduct) {
          throw new Error("Product not found.");
        }

        return {
          responseCode: "00",

          responseMessage: "Product updated successfully.",

          data: updatedProduct,
        };
      }

      /**
       * ========================================================================
       * API MODE
       * ========================================================================
       */

      return productService.updateProduct(productId, payload);
    },

    /**
     * --------------------------------------------------------------------------
     * SUCCESS
     * --------------------------------------------------------------------------
     */

    onSuccess: (data, variables) => {
      const updatedProduct = data?.data;

      /**
       * ========================================================================
       * UPDATE INDIVIDUAL PRODUCT CACHE
       * ========================================================================
       *
       * This ensures that if the edit screen or another screen asks for:
       *
       * useProduct(productId)
       *
       * it immediately receives the updated product.
       */

      if (updatedProduct) {
        queryClient.setQueryData(queryKeys.product(variables.productId), {
          responseCode: data.responseCode,

          responseMessage: data.responseMessage,

          data: updatedProduct,
        });
      }

      /**
       * ========================================================================
       * UPDATE PRODUCTS LIST CACHE
       * ========================================================================
       *
       * This is the important part for:
       *
       * app/(tabs)/products.tsx
       *
       * Instead of waiting for React Query to refetch, we immediately replace
       * the matching product in the cached product list.
       */

      if (updatedProduct) {
        queryClient.setQueryData(
          queryKeys.products,
          (
            current:
              | {
                  responseCode: string;
                  responseMessage: string;
                  data: MerchantProduct[];
                }
              | undefined
          ) => {
            if (!current) {
              return current;
            }

            return {
              ...current,

              data: current.data.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
              ),
            };
          }
        );
      }

      /**
       * ========================================================================
       * INVALIDATE PRODUCTS
       * ========================================================================
       *
       * Keep the invalidation as a safety net.
       *
       * For real API mode this ensures the list eventually reflects the
       * server's canonical response.
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      /**
       * ========================================================================
       * INVALIDATE INDIVIDUAL PRODUCT
       * ========================================================================
       */

      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.productId),
      });
    },
  });
}
