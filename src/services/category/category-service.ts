import { productService } from "@/services/products/product-service";

import {
  getMockCategories,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory,
} from "@/mocks/categories";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

import { categoryRepository } from "@/repositories/categories/sqliteCategoryRepository";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * GET CATEGORIES
 * ============================================================================
 *
 * Returns the domain model directly.
 *
 * ProductCategoryDto is the source-of-truth category representation.
 *
 * UI components such as Dropdown should map ProductCategoryDto[]
 * into DropdownOption[] at the presentation boundary.
 */
export async function getCategories(): Promise<ProductCategoryDto[]> {
  /**
   * ==========================================================================
   * MOCK MODE
   * ==========================================================================
   */

  if (USE_MOCK_PRODUCTS) {
    return getMockCategories()
      .filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * ==========================================================================
   * API MODE
   * ==========================================================================
   */

  try {
    const response = await productService.getCategories();

    const categories = response.data ?? [];

    await categoryRepository.saveCategories(categories);

    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn(
      "Failed to fetch categories from API. Using local SQLite data.",
      error
    );

    const categories = await categoryRepository.getCategories();

    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

/**
 * ============================================================================
 * CREATE CATEGORY
 * ============================================================================
 */

export async function createCategory(
  name: string,
  description?: string
): Promise<ProductCategoryDto> {
  /**
   * MOCK MODE
   */

  if (USE_MOCK_PRODUCTS) {
    return createMockCategory(name, description);
  }

  /**
   * API MODE
   */

  const response = await productService.createCategory({
    name: name.trim(),
    description,
  });

  const category = response.data;

  await categoryRepository.saveCategory(category);

  return category;
}

/**
 * ============================================================================
 * UPDATE CATEGORY
 * ============================================================================
 */

export async function updateCategory(
  categoryId: number,
  name: string,
  description?: string
): Promise<ProductCategoryDto> {
  /**
   * MOCK MODE
   */

  if (USE_MOCK_PRODUCTS) {
    const category = updateMockCategory(categoryId, name, description);

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  }

  /**
   * API MODE
   */

  const response = await productService.updateCategory(categoryId, {
    name: name.trim(),
    description,
  });

  const category = response.data;

  await categoryRepository.saveCategory(category);

  return category;
}

/**
 * ============================================================================
 * DELETE CATEGORY
 * ============================================================================
 */

export async function deleteCategory(categoryId: number): Promise<void> {
  /**
   * MOCK MODE
   */

  if (USE_MOCK_PRODUCTS) {
    const deleted = deleteMockCategory(categoryId);

    if (!deleted) {
      throw new Error("Category not found.");
    }

    return;
  }

  /**
   * API MODE
   */

  await productService.deleteCategory(categoryId);

  await categoryRepository.deleteCategory(categoryId);
}
