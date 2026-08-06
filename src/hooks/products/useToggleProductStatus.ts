import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import type { ApiResponse } from "@/types/api";
import type { MerchantProduct } from "@/types/product";

import { queryKeys } from "@/lib/queryKeys";

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: number;
      status: boolean;
    }) => productService.toggleProductStatus(productId, status),

    /**
     * ------------------------------------------------------------
     * Optimistic Update
     * ------------------------------------------------------------
     */
    onMutate: async ({ productId, status }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.products,
      });

      const previousProducts = queryClient.getQueryData<
        ApiResponse<MerchantProduct[]>
      >(queryKeys.products);

      queryClient.setQueryData<ApiResponse<MerchantProduct[]>>(
        queryKeys.products,
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            data: old.data.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    isActive: status,
                  }
                : product
            ),
          };
        }
      );

      return {
        previousProducts,
      };
    },

    /**
     * ------------------------------------------------------------
     * Rollback
     * ------------------------------------------------------------
     */
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products, context.previousProducts);
      }
    },

    /**
     * ------------------------------------------------------------
     * Sync with Server
     * ------------------------------------------------------------
     */
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });
    },
  });
}
