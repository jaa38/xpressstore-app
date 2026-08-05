import { productService } from "@/services/products/productService";

import type { DropdownOption } from "@/components/ui/Dropdown";

export async function getCategories(): Promise<DropdownOption[]> {
  const response = await productService.getCategories();

  return (
    response.data
      ?.filter((category) => category.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({
        label: category.name,
        value: String(category.id),
      })) ?? []
  );
}

export async function createCategory(
  name: string
): Promise<DropdownOption> {
  const response = await productService.createCategory({
    name: name.trim(),
  });

  return {
    label: response.data.name,
    value: String(response.data.id),
  };
}