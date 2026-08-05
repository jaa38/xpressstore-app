import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useProducts() {
  const query = useQuery({
    queryKey: ["products"],

    queryFn: () =>
      productService.getMerchantProducts(),
  });

  return {
    products: query.data?.data ?? [],

    ...query,
  };
}