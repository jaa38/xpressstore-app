import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProductVisibility } from "@/services/product-service";

export function useToggleProductVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, value }: { productId: string; value: boolean }) =>
      updateProductVisibility(productId, value),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
