import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_CATEGORIES } from "@/mocks/config";
import { deleteMockCategory } from "@/mocks/categories";

/**
 * ============================================================================
 * DELETE CATEGORY
 * ============================================================================
 */

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: number) => {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       */

      if (USE_MOCK_CATEGORIES) {
        const deleted = deleteMockCategory(categoryId);

        if (!deleted) {
          throw new Error("Category not found.");
        }

        return {
          success: true,
        };
      }

      /**
       * ----------------------------------------------------------------------
       * API MODE
       * ----------------------------------------------------------------------
       */

      return deleteCategory(categoryId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}
