import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_CATEGORIES } from "@/mocks/config";
import { createMockCategory } from "@/mocks/categories";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface CreateCategoryVariables {
  name: string;
  description?: string;
}

/**
 * ============================================================================
 * CREATE CATEGORY
 * ============================================================================
 */

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<ProductCategoryDto, Error, CreateCategoryVariables>({
    mutationFn: async ({
      name,
      description,
    }) => {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       */

      if (USE_MOCK_CATEGORIES) {
        return createMockCategory(
          name,
          description
        );
      }

      /**
       * ----------------------------------------------------------------------
       * API MODE
       * ----------------------------------------------------------------------
       */

      return createCategory(
        name,
        description
      );
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
    },
  });
}