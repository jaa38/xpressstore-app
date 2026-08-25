import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/category/category-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_CATEGORIES } from "@/mocks/config";
import { getMockCategories } from "@/mocks/categories";

/**
 * ============================================================================
 * USE CATEGORIES
 * ============================================================================
 *
 * Categories have their own independent mock switch.
 *
 * USE_MOCK_CATEGORIES = true
 *   → local mock categories
 *
 * USE_MOCK_CATEGORIES = false
 *   → real API
 *
 * Both modes intentionally return ProductCategoryDto[] so consumers
 * do not need to know where the data came from.
 * ============================================================================
 */

export function useCategories() {
  const query = useQuery({
    queryKey: queryKeys.productCategories,

    queryFn: async () => {
      if (USE_MOCK_CATEGORIES) {
        return getMockCategories();
      }

      return getCategories();
    },
  });

  return {
    data: query.data ?? [],

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isRefetching: query.isRefetching,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}
