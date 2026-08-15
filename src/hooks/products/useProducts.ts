import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import { queryKeys } from "@/lib/queryKeys";

import { queryWithCache } from "@/database/query";

const PRODUCTS_CACHE_MAX_AGE = 1000 * 60 * 60;

export function useProducts() {
  const query = useQuery({
    queryKey: queryKeys.products,

    queryFn: () =>
      queryWithCache(
        queryKeys.products,
        () => productService.getMerchantProducts(),
        {
          maxAge: PRODUCTS_CACHE_MAX_AGE,
        }
      ),
  });

  return {
    products: query.data?.data ?? [],

    ...query,
  };
}
