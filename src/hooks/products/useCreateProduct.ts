import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useCreateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      productService.createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}