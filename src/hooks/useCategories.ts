import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/category-service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const categories = await getCategories();

      return categories.sort((a, b) => a.label.localeCompare(b.label));
    },
  });
}
