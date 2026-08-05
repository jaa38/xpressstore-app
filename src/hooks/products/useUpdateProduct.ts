import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useUpdateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      productService.updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}