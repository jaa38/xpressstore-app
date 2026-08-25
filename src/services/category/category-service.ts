import { productService } from "@/services/products/product-service";

import { categoryRepository } from "@/repositories/categories/sqliteCategoryRepository";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * GET CATEGORIES
 * ============================================================================
 *
 * API-backed category service.
 *
 * Mock selection is handled by useCategories().
 * ============================================================================
 */

export async function getCategories(): Promise<ProductCategoryDto[]> {
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
  await productService.deleteCategory(categoryId);

  await categoryRepository.deleteCategory(categoryId);
}
