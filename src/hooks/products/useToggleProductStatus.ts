import { useMutation, useQueryClient } from "@tanstack/react-query";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";
import { toggleMockProductStatus } from "@/mocks/products";

import { productService } from "@/services/products/product-service";

interface ToggleProductStatusVariables {
  productId: number;
  status: boolean;
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, status }: ToggleProductStatusVariables) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const updatedProduct = toggleMockProductStatus(productId, status);

        if (!updatedProduct) {
          throw new Error("Product not found.");
        }

        return updatedProduct;
      }

      /**
       * ================================================================
       * API MODE
       * ================================================================
       */

      return productService.toggleProductStatus(productId, status);
    },

    onSuccess: () => {
      /**
       * Refresh the product query after either:
       *
       * - mock mutation
       * - API mutation
       *
       * The mock source is synchronous, but invalidating here keeps
       * the hook behaviour consistent with the API path.
       */
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
