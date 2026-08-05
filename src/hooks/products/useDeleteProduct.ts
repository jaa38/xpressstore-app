import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useDeleteProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      productService.deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}