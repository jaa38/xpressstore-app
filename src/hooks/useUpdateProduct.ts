import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "@/services/product-service";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Parameters<typeof updateProduct>[1];
    }) => updateProduct(id, values),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.id],
      });
    },
  });
}