import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
  });
}
