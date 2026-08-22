import { useMutation, useQueryClient } from "@tanstack/react-query";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";
import { deleteMockProduct } from "@/mocks/products";

import { productService } from "@/services/products/productService";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      /**
       * ================================================================
       * MOCK MODE
       * ================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const deleted = deleteMockProduct(productId);

        if (!deleted) {
          throw new Error("Product not found.");
        }

        return {
          success: true,
        };
      }

      /**
       * ================================================================
       * API MODE
       * ================================================================
       */

      return productService.deleteProduct(productId);
    },

    onSuccess: () => {
      /**
       * Keep React Query synchronized after mutation.
       */
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
