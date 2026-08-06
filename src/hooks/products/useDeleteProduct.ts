import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-product"],

    mutationFn: (productId: number) => productService.deleteProduct(productId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });
    },
  });
}
