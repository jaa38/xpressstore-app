import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

import type { UpdateProductRequest } from "@/types/product";

interface UpdateProductMutationParams {
  productId: number;
  payload: UpdateProductRequest;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: UpdateProductMutationParams) =>
      productService.updateProduct(productId, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.productId),
      });
    },
  });
}
