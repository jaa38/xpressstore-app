import { productService } from "@/services/products/productService";

import { categoryRepository } from "@/repositories/categories/sqliteCategoryRepository";

import type { DropdownOption } from "@/components/ui/Dropdown";

export async function getCategories(): Promise<DropdownOption[]> {
  try {
    const response = await productService.getCategories();

    const categories = response.data ?? [];

    await categoryRepository.saveCategories(categories);

    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({
        label: category.name,
        value: String(category.id),
      }));
  } catch (error) {
    console.warn(
      "Failed to fetch categories from API. Using local SQLite data.",
      error
    );

    const categories = await categoryRepository.getCategories();

    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({
        label: category.name,
        value: String(category.id),
      }));
  }
}

export async function createCategory(name: string): Promise<DropdownOption> {
  const response = await productService.createCategory({
    name: name.trim(),
  });

  const category = response.data;

  await categoryRepository.saveCategory(category);

  return {
    label: category.name,
    value: String(category.id),
  };
}

export async function updateCategory(
  categoryId: number,
  name: string,
  description?: string
): Promise<DropdownOption> {
  const response = await productService.updateCategory(categoryId, {
    name: name.trim(),
    description,
  });

  const category = response.data;

  await categoryRepository.saveCategory(category);

  return {
    label: category.name,
    value: String(category.id),
  };
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await productService.deleteCategory(categoryId);

  await categoryRepository.deleteCategory(categoryId);
}
