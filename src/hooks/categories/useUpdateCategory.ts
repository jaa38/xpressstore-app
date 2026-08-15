import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCategory } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

interface UpdateCategoryVariables {
  categoryId: number;
  name: string;
  description?: string;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      name,
      description,
    }: UpdateCategoryVariables) =>
      updateCategory(categoryId, name, description),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}