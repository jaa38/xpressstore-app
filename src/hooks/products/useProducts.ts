import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

export function useProducts() {
  const query = useQuery({
    queryKey: queryKeys.products,

    queryFn: () => productService.getMerchantProducts(),
  });

  return {
    products: query.data?.data ?? [],

    ...query,
  };
}