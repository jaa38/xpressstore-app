import type { DropdownOption } from "@/components/ui/Dropdown";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * CATEGORY → DROPDOWN MAPPER
 * ============================================================================
 */

export function mapCategoryToDropdown(
  category: ProductCategoryDto
): DropdownOption {
  return {
    label: category.name,
    value: String(category.id),
  };
}

/**
 * ============================================================================
 * CATEGORIES → DROPDOWN MAPPER
 * ============================================================================
 */

export function mapCategoriesToDropdown(
  categories: ProductCategoryDto[]
): DropdownOption[] {
  return categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(mapCategoryToDropdown);
}
