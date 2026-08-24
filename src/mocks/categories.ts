// src/mocks/categories.ts

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * MOCK CATEGORIES
 * ============================================================================
 */

export const MOCK_CATEGORIES: ProductCategoryDto[] = [
  {
    id: 1,
    name: "Fashion",
    description: "Fashion and clothing products.",
    isActive: true,
  },
  {
    id: 2,
    name: "Bags",
    description: "Bags and accessories.",
    isActive: true,
  },
  {
    id: 3,
    name: "Shoes",
    description: "Shoes and footwear.",
    isActive: true,
  },
  {
    id: 4,
    name: "Electronics",
    description: "Electronic devices and accessories.",
    isActive: true,
  },
  {
    id: 5,
    name: "Accessories",
    description: "Fashion and lifestyle accessories.",
    isActive: true,
  },
  {
    id: 6,
    name: "Home & Office",
    description: "Home and office products.",
    isActive: true,
  },
  {
    id: 7,
    name: "Travel",
    description: "Travel products and accessories.",
    isActive: true,
  },
  {
    id: 8,
    name: "Other",
    description: "Other products.",
    isActive: true,
  },
];

/**
 * ============================================================================
 * GET CATEGORIES
 * ============================================================================
 */

export function getMockCategories(): ProductCategoryDto[] {
  return [...MOCK_CATEGORIES];
}

/**
 * ============================================================================
 * GET CATEGORY BY ID
 * ============================================================================
 */

export function getMockCategoryById(
  id: number
): ProductCategoryDto | undefined {
  return MOCK_CATEGORIES.find((category) => category.id === id);
}

/**
 * ============================================================================
 * CREATE CATEGORY
 * ============================================================================
 */

export function createMockCategory(
  name: string,
  description?: string
): ProductCategoryDto {
  const normalizedName = name.trim();

  const existingCategory = MOCK_CATEGORIES.find(
    (category) =>
      category.name.trim().toLowerCase() === normalizedName.toLowerCase()
  );

  if (existingCategory) {
    throw new Error("A category with this name already exists.");
  }

  const newCategory: ProductCategoryDto = {
    id: Date.now(),
    name: normalizedName,
    description: description?.trim() ?? "",
    isActive: true,
  };

  MOCK_CATEGORIES.push(newCategory);

  return newCategory;
}

/**
 * ============================================================================
 * UPDATE CATEGORY
 * ============================================================================
 */

export function updateMockCategory(
  id: number,
  name: string,
  description?: string
): ProductCategoryDto | undefined {
  const index = MOCK_CATEGORIES.findIndex((category) => category.id === id);

  if (index === -1) {
    return undefined;
  }

  const existingCategory = MOCK_CATEGORIES[index];

  if (!existingCategory) {
    return undefined;
  }

  const normalizedName = name.trim();

  const duplicate = MOCK_CATEGORIES.find(
    (category) =>
      category.id !== id &&
      category.name.trim().toLowerCase() === normalizedName.toLowerCase()
  );

  if (duplicate) {
    throw new Error("A category with this name already exists.");
  }

  const updatedCategory: ProductCategoryDto = {
    ...existingCategory,
    name: normalizedName,
    description: description?.trim() ?? "",
  };

  MOCK_CATEGORIES[index] = updatedCategory;

  return updatedCategory;
}

/**
 * ============================================================================
 * DELETE CATEGORY
 * ============================================================================
 */

export function deleteMockCategory(id: number): boolean {
  const index = MOCK_CATEGORIES.findIndex((category) => category.id === id);

  if (index === -1) {
    return false;
  }

  MOCK_CATEGORIES.splice(index, 1);

  return true;
}
