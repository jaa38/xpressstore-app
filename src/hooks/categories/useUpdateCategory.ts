import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCategory } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_CATEGORIES } from "@/mocks/config";
import { updateMockCategory } from "@/mocks/categories";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface UpdateCategoryVariables {
  categoryId: number;
  name: string;
  description?: string;
}

/**
 * ============================================================================
 * UPDATE CATEGORY
 * ============================================================================
 */

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<ProductCategoryDto, Error, UpdateCategoryVariables>({
    mutationFn: async ({ categoryId, name, description }) => {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       */

      if (USE_MOCK_CATEGORIES) {
        const category = updateMockCategory(categoryId, name, description);

        if (!category) {
          throw new Error("Category not found.");
        }

        return category;
      }

      /**
       * ----------------------------------------------------------------------
       * API MODE
       * ----------------------------------------------------------------------
       */

      return updateCategory(categoryId, name, description);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}
