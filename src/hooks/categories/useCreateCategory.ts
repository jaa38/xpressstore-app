import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

interface CreateCategoryVariables {
  name: string;
  description?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description }: CreateCategoryVariables) =>
      createCategory(name, description),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}
