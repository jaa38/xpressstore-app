import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useToggleProductStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: number;

      status: boolean;
    }) =>
      productService.toggleProductStatus(
        productId,
        status
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}