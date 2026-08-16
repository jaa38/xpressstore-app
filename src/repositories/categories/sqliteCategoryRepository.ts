import type {
  ProductCategoryDto,
  CreateProductCategoryRequest,
} from "@/types/product";

import { getDatabase } from "@/database";

import type { CategoryRepository } from "./categoryRepository";

function mapRowToCategory(row: CategoryRow): ProductCategoryDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.is_active === 1,
    slug: row.slug ?? undefined,
  };
}

interface CategoryRow {
  id: number;
  name: string;
  description: string;
  is_active: number;
  slug: string | null;
  updated_at: number;
}

class SQLiteCategoryRepository implements CategoryRepository {
  async getCategories(): Promise<ProductCategoryDto[]> {
    const database = await getDatabase();

    const rows = await database.getAllAsync<CategoryRow>(`
        SELECT
          id,
          name,
          description,
          is_active,
          slug,
          updated_at
        FROM categories
        ORDER BY name ASC
      `);

    return rows.map(mapRowToCategory);
  }

  async getCategoryById(id: number): Promise<ProductCategoryDto | null> {
    const database = await getDatabase();

    const row = await database.getFirstAsync<CategoryRow>(
      `
          SELECT
            id,
            name,
            description,
            is_active,
            slug,
            updated_at
          FROM categories
          WHERE id = ?
          LIMIT 1
        `,
      id
    );

    if (!row) {
      return null;
    }

    return mapRowToCategory(row);
  }

  async saveCategories(categories: ProductCategoryDto[]): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const category of categories) {
        await database.runAsync(
          `
              INSERT INTO categories (
                id,
                name,
                description,
                is_active,
                slug,
                updated_at
              )
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(id)
              DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                is_active = excluded.is_active,
                slug = excluded.slug,
                updated_at = excluded.updated_at
            `,
          category.id,
          category.name,
          category.description ?? "",
          category.isActive ? 1 : 0,
          category.slug ?? null,
          Date.now()
        );
      }
    });
  }

  async saveCategory(category: ProductCategoryDto): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        INSERT INTO categories (
          id,
          name,
          description,
          is_active,
          slug,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id)
        DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          is_active = excluded.is_active,
          slug = excluded.slug,
          updated_at = excluded.updated_at
      `,
      category.id,
      category.name,
      category.description ?? "",
      category.isActive ? 1 : 0,
      category.slug ?? null,
      Date.now()
    );
  }

  async createCategory(
    _data: CreateProductCategoryRequest
  ): Promise<ProductCategoryDto> {
    throw new Error(
      "Category creation must be performed through the API before being persisted locally."
    );
  }

  async deleteCategory(id: number): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM categories
        WHERE id = ?
      `,
      id
    );
  }

  async clearCategories(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM categories
    `);
  }
}

export const categoryRepository = new SQLiteCategoryRepository();
