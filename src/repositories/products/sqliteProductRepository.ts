import type {
  MerchantProduct,
  ProductCategoryDto,
  ProductImageDto,
  ProductVariationDto,
} from "@/types/product";

import { getDatabase } from "@/database";

import type { ProductRepository } from "./productRepository";

/**
 * ============================================================================
 * SQLite Row Types
 * ============================================================================
 */

interface ProductRow {
  id: number;
  product_reference: string;
  product_name: string;
  description: string;
  unit_price: number;
  currency: string;
  in_stock: number;
  total_in_stock: number;
  low_stock_alert: number;
  is_active: number;
  youtube_link: string | null;
  unit: string | null;
  product_location: string | null;
  min_order_qty: string | null;
  updated_at: number;
}

interface ProductImageRow {
  product_id: number;
  filename: string;
  url: string;
  sort_order: number;
}

interface ProductCategoryRow {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  is_active: number;
  slug: string | null;
}

interface ProductVariationRow {
  product_id: number;
  name: string;
  options: string;
  sort_order: number;
}

/**
 * ============================================================================
 * Mapping Helpers
 * ============================================================================
 */

function mapProductRow(
  row: ProductRow,
  productImages: ProductImageDto[],
  productCategories: ProductCategoryDto[],
  variations: ProductVariationDto[]
): MerchantProduct {
  return {
    id: row.id,

    productReference: row.product_reference,

    productName: row.product_name,

    description: row.description,

    unitPrice: row.unit_price,

    currency: row.currency as MerchantProduct["currency"],

    inStock: row.in_stock === 1,

    totalInStock: row.total_in_stock,

    lowStockAlert: row.low_stock_alert,

    isActive: row.is_active === 1,

    youtubeLink: row.youtube_link ?? undefined,

    unit: row.unit ?? undefined,

    productLocation: row.product_location ?? undefined,

    minOrderQty: row.min_order_qty ?? undefined,

    productImages,

    productCategories,

    variations,
  };
}

function mapImageRows(rows: ProductImageRow[]): ProductImageDto[] {
  return rows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      filename: row.filename,
      url: row.url,
    }));
}

function mapCategoryRows(rows: ProductCategoryRow[]): ProductCategoryDto[] {
  return rows.map((row) => ({
    id: row.category_id,

    name: row.name,

    description: row.description,

    isActive: row.is_active === 1,

    slug: row.slug ?? undefined,
  }));
}

function mapVariationRows(rows: ProductVariationRow[]): ProductVariationDto[] {
  return rows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      name: row.name,

      options: JSON.parse(row.options) as string[],
    }));
}

/**
 * ============================================================================
 * SQLite Repository
 * ============================================================================
 */

class SQLiteProductRepository implements ProductRepository {
  /**
   * --------------------------------------------------------------------------
   * Get Products
   * --------------------------------------------------------------------------
   */

  async getProducts(): Promise<MerchantProduct[]> {
    const database = await getDatabase();

    const rows = await database.getAllAsync<ProductRow>(`
        SELECT
          id,
          product_reference,
          product_name,
          description,
          unit_price,
          currency,
          in_stock,
          total_in_stock,
          low_stock_alert,
          is_active,
          youtube_link,
          unit,
          product_location,
          min_order_qty,
          updated_at
        FROM products
        ORDER BY product_name ASC
      `);

    const products = await Promise.all(
      rows.map((row) => this.hydrateProduct(database, row))
    );

    return products;
  }

  /**
   * --------------------------------------------------------------------------
   * Get Product By ID
   * --------------------------------------------------------------------------
   */

  async getProductById(id: string): Promise<MerchantProduct | null> {
    const database = await getDatabase();

    const productId = Number(id);

    if (!Number.isFinite(productId)) {
      return null;
    }

    const row = await database.getFirstAsync<ProductRow>(
      `
          SELECT
            id,
            product_reference,
            product_name,
            description,
            unit_price,
            currency,
            in_stock,
            total_in_stock,
            low_stock_alert,
            is_active,
            youtube_link,
            unit,
            product_location,
            min_order_qty,
            updated_at
          FROM products
          WHERE id = ?
          LIMIT 1
        `,
      productId
    );

    if (!row) {
      return null;
    }

    return this.hydrateProduct(database, row);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Products
   * --------------------------------------------------------------------------
   */

  async saveProducts(products: MerchantProduct[]): Promise<void> {
    await this.saveMerchantProducts(products);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Product
   * --------------------------------------------------------------------------
   */

  async saveProduct(product: MerchantProduct): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      await this.upsertProduct(database, product);
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Save Merchant Products
   * --------------------------------------------------------------------------
   */

  async saveMerchantProducts(products: MerchantProduct[]): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const product of products) {
        await this.upsertProduct(database, product);
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Product
   * --------------------------------------------------------------------------
   */

  private async upsertProduct(
    database: Awaited<ReturnType<typeof getDatabase>>,
    product: MerchantProduct
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO products (
          id,
          product_reference,
          product_name,
          description,
          unit_price,
          currency,
          in_stock,
          total_in_stock,
          low_stock_alert,
          is_active,
          youtube_link,
          unit,
          product_location,
          min_order_qty,
          updated_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
          product_reference = excluded.product_reference,
          product_name = excluded.product_name,
          description = excluded.description,
          unit_price = excluded.unit_price,
          currency = excluded.currency,
          in_stock = excluded.in_stock,
          total_in_stock = excluded.total_in_stock,
          low_stock_alert = excluded.low_stock_alert,
          is_active = excluded.is_active,
          youtube_link = excluded.youtube_link,
          unit = excluded.unit,
          product_location = excluded.product_location,
          min_order_qty = excluded.min_order_qty,
          updated_at = excluded.updated_at
      `,
      product.id,
      product.productReference,
      product.productName,
      product.description,
      product.unitPrice,
      product.currency,
      product.inStock ? 1 : 0,
      product.totalInStock,
      product.lowStockAlert,
      product.isActive ? 1 : 0,
      product.youtubeLink ?? null,
      product.unit ?? null,
      product.productLocation ?? null,
      product.minOrderQty ?? null,
      Date.now()
    );

    /**
     * Replace child records so SQLite always represents
     * the latest API response.
     */

    await database.runAsync(
      `
        DELETE FROM product_images
        WHERE product_id = ?
      `,
      product.id
    );

    await database.runAsync(
      `
        DELETE FROM product_categories
        WHERE product_id = ?
      `,
      product.id
    );

    await database.runAsync(
      `
        DELETE FROM product_variations
        WHERE product_id = ?
      `,
      product.id
    );

    /**
     * Product images.
     */

    for (let index = 0; index < product.productImages.length; index += 1) {
      const image = product.productImages[index];

      if (!image) {
        continue;
      }

      await database.runAsync(
        `
      INSERT INTO product_images (
        product_id,
        filename,
        url,
        sort_order
      )
      VALUES (?, ?, ?, ?)
    `,
        product.id,
        image.filename,
        image.url,
        index
      );
    }

    /**
     * Product categories.
     */

    for (const category of product.productCategories) {
      await database.runAsync(
        `
          INSERT INTO product_categories (
            product_id,
            category_id,
            name,
            description,
            is_active,
            slug
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        product.id,
        category.id,
        category.name,
        category.description ?? "",
        category.isActive ? 1 : 0,
        category.slug ?? null
      );
    }

    /**
     * Product variations.
     */

    for (let index = 0; index < product.variations.length; index += 1) {
      const variation = product.variations[index];

      if (!variation) {
        continue;
      }

      await database.runAsync(
        `
      INSERT INTO product_variations (
        product_id,
        name,
        options,
        sort_order
      )
      VALUES (?, ?, ?, ?)
    `,
        product.id,
        variation.name,
        JSON.stringify(variation.options),
        index
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Hydrate Product
   * --------------------------------------------------------------------------
   */

  private async hydrateProduct(
    database: Awaited<ReturnType<typeof getDatabase>>,
    row: ProductRow
  ): Promise<MerchantProduct> {
    const imageRows = await database.getAllAsync<ProductImageRow>(
      `
          SELECT
            product_id,
            filename,
            url,
            sort_order
          FROM product_images
          WHERE product_id = ?
          ORDER BY sort_order ASC
        `,
      row.id
    );

    const categoryRows = await database.getAllAsync<ProductCategoryRow>(
      `
          SELECT
            product_id,
            category_id,
            name,
            description,
            is_active,
            slug
          FROM product_categories
          WHERE product_id = ?
          ORDER BY name ASC
        `,
      row.id
    );

    const variationRows = await database.getAllAsync<ProductVariationRow>(
      `
          SELECT
            product_id,
            name,
            options,
            sort_order
          FROM product_variations
          WHERE product_id = ?
          ORDER BY sort_order ASC
        `,
      row.id
    );

    return mapProductRow(
      row,
      mapImageRows(imageRows),
      mapCategoryRows(categoryRows),
      mapVariationRows(variationRows)
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Delete Product
   * --------------------------------------------------------------------------
   */

  async deleteProduct(id: string): Promise<void> {
    const database = await getDatabase();

    const productId = Number(id);

    if (!Number.isFinite(productId)) {
      return;
    }

    await database.runAsync(
      `
        DELETE FROM products
        WHERE id = ?
      `,
      productId
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Products
   * --------------------------------------------------------------------------
   */

  async clearProducts(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM products
    `);
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const productRepository = new SQLiteProductRepository();
