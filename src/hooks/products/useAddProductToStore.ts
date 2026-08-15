import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

interface AddProductToStoreVariables {
  productId: number;
  storeIds: number[];
}

export function useAddProductToStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      storeIds,
    }: AddProductToStoreVariables) =>
      productService.addProductToStore({
        productId,
        storeIds,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}