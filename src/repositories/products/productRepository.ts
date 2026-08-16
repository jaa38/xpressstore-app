import type { MerchantProduct } from "@/types/product";

export interface ProductRepository {
  /**
   * Retrieve all locally persisted merchant products.
   */
  getProducts(): Promise<MerchantProduct[]>;

  /**
   * Retrieve a locally persisted merchant product by ID.
   */
  getProductById(id: string): Promise<MerchantProduct | null>;

  /**
   * Persist multiple merchant products.
   */
  saveProducts(products: MerchantProduct[]): Promise<void>;

  /**
   * Persist a single merchant product.
   */
  saveProduct(product: MerchantProduct): Promise<void>;

  /**
   * Delete a locally persisted product.
   */
  deleteProduct(id: string): Promise<void>;

  /**
   * Remove all locally persisted products.
   */
  clearProducts(): Promise<void>;

  /**
   * Persist merchant products returned by the API.
   */
  saveMerchantProducts(products: MerchantProduct[]): Promise<void>;
}
