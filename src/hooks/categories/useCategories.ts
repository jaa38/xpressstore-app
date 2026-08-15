import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.productCategories,

    queryFn: async () => {
      const categories = await getCategories();

      return categories.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
    },
  });
}