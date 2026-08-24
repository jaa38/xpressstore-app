import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.productCategories,

    queryFn: getCategories,
  });
}
