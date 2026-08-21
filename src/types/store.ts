/**
 * ============================================================================
 * STORE TYPES
 * ============================================================================
 */

/**
 * Product layout used by the storefront.
 *
 * This is currently a local presentation preference.
 * It is NOT part of the Store API UpdateStore request.
 */
export type StoreLayout = "grid" | "list";

/**
 * ============================================================================
 * STORE
 * ============================================================================
 */

export interface Store {
  storeId: number;

  storeName: string;

  storeReference: string;

  storeLink: string;

  currency: string;

  welcomeMessage?: string;

  description?: string;

  isActive: boolean;

  themeColor?: string;

  /**
   * Local storefront product layout preference.
   *
   * The backend API does not currently expose this field.
   */
  layout: StoreLayout;

  callBackUrl?: string;

  successMessage?: string;

  whatsAppNumber?: string;

  phoneNumber?: string;

  email?: string;

  instagram?: string;

  facebook?: string;

  twitter?: string;

  products?: number[];

  discounts?: number[];
}

/**
 * ============================================================================
 * STORE SUMMARY
 * ============================================================================
 */

export interface StoreSummary {
  storeId: number;

  storeName: string;

  storeReference: string;

  currency: string;

  isActive: boolean;
}

/**
 * ============================================================================
 * CREATE STORE
 * ============================================================================
 */

export interface CreateStoreRequest {
  storeName: string;

  storeReference: string;

  currency: string;

  storeLink: string;

  welcomeMessage?: string;

  description?: string;

  storeDiscounts?: number[];

  storeShippingRegion?: number[];

  storeProducts?: number[];
}

/**
 * ============================================================================
 * UPDATE STORE
 * ============================================================================
 */

export interface UpdateStoreRequest {
  id: number;

  storeName: string;

  currency: string;

  storeReference: string;

  storeLink: string;

  isActive: boolean;

  themeColor?: string;

  welcomeMessage?: string;

  description?: string;

  callBackUrl?: string;

  successMessage?: string;

  whatsAppNumber?: string;

  phoneNumber?: string;

  email?: string;

  instagram?: string;

  facebook?: string;

  twitter?: string;

  storeProducts?: number[];

  storeDiscounts?: number[];

  storeShippingRegion?: number[];
}

/**
 * ============================================================================
 * SHIPPING REGIONS
 * ============================================================================
 */

export interface ShippingRegion {
  id: number;

  region: string;

  state: string;

  shippingFee: number;
}

export interface CreateShippingRegionRequest {
  region: string;

  state: string;

  shippingFee: number;
}

export interface UpdateShippingRegionRequest {
  id: number;

  region: string;

  state: string;

  shippingFee: number;
}

/**
 * ============================================================================
 * STORE VALIDATION
 * ============================================================================
 */

export interface StoreAvailabilityResponse {
  isAvailable: boolean;
}
