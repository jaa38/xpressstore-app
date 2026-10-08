import type { ProductCategoryDto } from "@/types/product";

import {
  MOCK_CATEGORIES,
  getMockCategories as getCategories,
  getMockCategoryById,
} from "@/mocks/categories";

/**
 * ============================================================================
 * MOCK PRODUCT CATEGORIES
 * ============================================================================
 */

export { MOCK_CATEGORIES };

/**
 * ============================================================================
 * GET CATEGORIES
 * ============================================================================
 */

export function getMockCategories(): ProductCategoryDto[] {
  return getCategories();
}

/**
 * ============================================================================
 * GET CATEGORY
 * ============================================================================
 */

export function getMockCategory(
  id: number
): ProductCategoryDto | undefined {
  return getMockCategoryById(id);
}
