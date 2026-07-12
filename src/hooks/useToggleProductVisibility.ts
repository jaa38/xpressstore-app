import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProductVisibility } from "@/services/product-service";

import type { Product } from "@/types/product";

type ToggleVisibilityContext = {
  previousProducts?: Product[];
};

export function useToggleProductVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, value }: { productId: string; value: boolean }) =>
      updateProductVisibility(productId, value),

    onMutate: async ({ productId, value }) => {
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      queryClient.setQueryData<Product[]>(["products"], (old = []) =>
        old.map((product) =>
          product.id === productId
            ? {
                ...product,
                visible: value,
              }
            : product
        )
      );

      return { previousProducts };
    },

    onError: (
      _error,
      _variables,
      context: ToggleVisibilityContext | undefined
    ) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },

    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
