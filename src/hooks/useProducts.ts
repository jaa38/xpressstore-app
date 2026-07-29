import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/product/product-service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}
