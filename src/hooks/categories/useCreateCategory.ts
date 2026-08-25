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

    onSuccess: async () => {
      /**
       * ==========================================================================
       * REFRESH CATEGORIES
       * ==========================================================================
       *
       * The categories screen uses:
       *
       * ["product-categories"]
       *
       * Refresh the query after a successful creation so the newly-created
       * category appears immediately when returning to the categories screen.
       */

      await queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}
