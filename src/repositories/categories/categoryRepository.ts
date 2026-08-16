import type {
  ProductCategoryDto,
  CreateProductCategoryRequest,
} from "@/types/product";

export interface CategoryRepository {
  getCategories(): Promise<ProductCategoryDto[]>;

  getCategoryById(
    id: number
  ): Promise<ProductCategoryDto | null>;

  saveCategories(
    categories: ProductCategoryDto[]
  ): Promise<void>;

  saveCategory(
    category: ProductCategoryDto
  ): Promise<void>;

  createCategory(
    data: CreateProductCategoryRequest
  ): Promise<ProductCategoryDto>;

  deleteCategory(
    id: number
  ): Promise<void>;

  clearCategories(): Promise<void>;
}