import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useProduct(
  productId?: number
) {
  const query = useQuery({
    queryKey: ["products", productId],

    queryFn: () =>
      productService.getProduct(
        productId as number
      ),

    enabled: !!productId,
  });

  return {
    product: query.data?.data,

    ...query,
  };
}