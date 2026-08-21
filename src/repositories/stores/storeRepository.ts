import type {
  ShippingRegion,
  Store,
  StoreLayout,
  StoreSummary,
} from "@/types/store";

/**
 * ============================================================================
 * STORE REPOSITORY
 * ============================================================================
 */

export interface StoreRepository {
  /**
   * --------------------------------------------------------------------------
   * Stores
   * --------------------------------------------------------------------------
   */

  getStores(): Promise<Store[]>;

  getStoreById(id: number): Promise<Store | null>;

  getStoreSummaries(): Promise<StoreSummary[]>;

  saveStores(stores: Store[]): Promise<void>;

  saveStore(store: Store): Promise<void>;

  /**
   * Update the local storefront layout preference.
   *
   * This does not call the API.
   */
  updateStoreLayout(id: number, layout: StoreLayout): Promise<void>;

  deleteStore(id: number): Promise<void>;

  clearStores(): Promise<void>;

  /**
   * --------------------------------------------------------------------------
   * Shipping Regions
   * --------------------------------------------------------------------------
   */

  getShippingRegions(): Promise<ShippingRegion[]>;

  saveShippingRegions(regions: ShippingRegion[]): Promise<void>;
}
