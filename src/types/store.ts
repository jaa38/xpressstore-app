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

export interface StoreSummary {
  storeId: number;

  storeName: string;

  storeReference: string;

  currency: string;

  isActive: boolean;
}

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

export interface StoreAvailabilityResponse {
  isAvailable: boolean;
}