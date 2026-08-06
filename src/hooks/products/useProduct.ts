import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { mapMerchantProductToEdit } from "@/mappers/product/mapMerchantProductToEdit";

import { queryKeys } from "@/lib/queryKeys";

export function useProduct(productId?: number) {
  const query = useQuery({
    queryKey: queryKeys.product(productId as number),

    queryFn: () => productService.getProduct(productId as number),

    enabled: !!productId,

    select: (response) => ({
      ...response,

      data: mapMerchantProductToEdit(response.data),
    }),
  });

  return {
    product: query.data?.data,

    ...query,
  };
}
