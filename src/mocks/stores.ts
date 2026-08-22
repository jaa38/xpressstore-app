import type {
  ShippingRegion,
  Store,
  StoreLayout,
  StoreSummary,
  UpdateStoreRequest,
} from "@/types/store";

/**
 * ============================================================================
 * MOCK STORES
 * ============================================================================
 */

export const MOCK_STORES: Store[] = [
  {
    storeId: 1,

    storeName: "My Fashion Store",

    storeReference: "my-fashion-store",

    storeLink: "https://storelink.myxpresspay.com/store/my-fashion-store",

    currency: "NGN",

    welcomeMessage: "Welcome to My Fashion Store.",

    description:
      "A modern fashion storefront for clothing, footwear and accessories.",

    isActive: true,

    themeColor: "#0F4082",

    layout: "grid",

    callBackUrl: "https://example.com/fashion/callback",

    successMessage: "Thank you for shopping with My Fashion Store!",

    whatsAppNumber: "+2348012345678",

    phoneNumber: "+2348012345678",

    email: "hello@myfashionstore.com",

    instagram: "myfashionstore",

    facebook: "myfashionstore",

    twitter: "myfashionstore",

    /**
     * Products currently assigned to this store.
     */
    products: [1, 2, 3, 4],

    discounts: [],
  },

  {
    storeId: 2,

    storeName: "Tech Store",

    storeReference: "tech-store",

    storeLink: "https://storelink.myxpresspay.com/store/tech-store",

    currency: "NGN",

    welcomeMessage: "Welcome to Tech Store.",

    description: "Technology products, accessories and electronics.",

    isActive: true,

    themeColor: "#2563EB",

    layout: "grid",

    callBackUrl: "https://example.com/tech/callback",

    successMessage: "Thank you for shopping with Tech Store!",

    whatsAppNumber: "+2348023456789",

    phoneNumber: "+2348023456789",

    email: "hello@techstore.com",

    instagram: "techstore",

    facebook: "techstore",

    twitter: "techstore",

    /**
     * Products currently assigned to this store.
     */
    products: [4, 6, 8, 10],

    discounts: [],
  },

  {
    storeId: 3,

    storeName: "Home Essentials",

    storeReference: "home-essentials",

    storeLink: "https://storelink.myxpresspay.com/store/home-essentials",

    currency: "NGN",

    welcomeMessage: "Welcome to Home Essentials.",

    description: "Essential products for your home and everyday living.",

    isActive: false,

    themeColor: "#F59E0B",

    layout: "grid",

    callBackUrl: "https://example.com/home/callback",

    successMessage: "Thank you for shopping with Home Essentials!",

    whatsAppNumber: "+2348034567890",

    phoneNumber: "+2348034567890",

    email: "hello@homeessentials.com",

    instagram: "homeessentials",

    facebook: "homeessentials",

    twitter: "homeessentials",

    /**
     * Products currently assigned to this store.
     */
    products: [5, 7, 12],

    discounts: [],
  },
];

/**
 * ============================================================================
 * IN-MEMORY STORE STATE
 * ============================================================================
 *
 * This is the source of truth while mock mode is enabled.
 * ============================================================================
 */

let mockStores: Store[] = MOCK_STORES.map((store) => ({
  ...store,

  products: [...(store.products ?? [])],

  discounts: [...(store.discounts ?? [])],
}));

/**
 * ============================================================================
 * GET ALL STORES
 * ============================================================================
 */

export function getMockStores(): Store[] {
  return mockStores.map((store) => ({
    ...store,

    products: [...(store.products ?? [])],

    discounts: [...(store.discounts ?? [])],
  }));
}

/**
 * ============================================================================
 * GET STORE
 * ============================================================================
 */

export function getMockStore(storeId: number): Store | undefined {
  const store = mockStores.find((item) => item.storeId === storeId);

  if (!store) {
    return undefined;
  }

  return {
    ...store,

    products: [...(store.products ?? [])],

    discounts: [...(store.discounts ?? [])],
  };
}

/**
 * ============================================================================
 * ADD PRODUCT TO STORE
 * ============================================================================
 *
 * Adds a product ID to a store.
 *
 * Used while mock mode is enabled.
 *
 * A product will not be added twice.
 * ============================================================================
 */

export function addMockProductToStore(
  storeId: number,
  productId: number
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    /**
     * This is not the requested store.
     */

    if (store.storeId !== storeId) {
      return store;
    }

    /**
     * Get the existing product IDs.
     */

    const products = store.products ?? [];

    /**
     * Product already exists.
     *
     * Do not create a duplicate.
     */

    if (products.includes(productId)) {
      updatedStore = {
        ...store,

        products: [...products],

        discounts: [...(store.discounts ?? [])],
      };

      return updatedStore;
    }

    /**
     * Add the product.
     */

    updatedStore = {
      ...store,

      products: [...products, productId],

      discounts: [...(store.discounts ?? [])],
    };

    return updatedStore;
  });

  /**
   * Store wasn't found.
   */

  if (!updatedStore) {
    return undefined;
  }

  /**
   * Return a defensive copy.
   */

  return {
    ...updatedStore,

    products: [...(updatedStore.products ?? [])],

    discounts: [...(updatedStore.discounts ?? [])],
  };
}

/**
 * ============================================================================
 * REMOVE PRODUCT FROM STORE
 * ============================================================================
 */

export function removeMockProductFromStore(
  storeId: number,
  productId: number
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    const products = store.products ?? [];

    updatedStore = {
      ...store,

      products: products.filter((id) => id !== productId),

      discounts: [...(store.discounts ?? [])],
    };

    return updatedStore;
  });

  return updatedStore;
}

/**
 * ============================================================================
 * UPDATE STORE
 * ============================================================================
 */

export function updateMockStore(
  storeId: number,
  updates: Partial<UpdateStoreRequest>
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    updatedStore = {
      ...store,

      ...(updates.storeName !== undefined && {
        storeName: updates.storeName,
      }),

      ...(updates.storeReference !== undefined && {
        storeReference: updates.storeReference,
      }),

      ...(updates.storeLink !== undefined && {
        storeLink: updates.storeLink,
      }),

      ...(updates.currency !== undefined && {
        currency: updates.currency,
      }),

      ...(updates.isActive !== undefined && {
        isActive: updates.isActive,
      }),

      ...(updates.themeColor !== undefined && {
        themeColor: updates.themeColor,
      }),

      ...(updates.welcomeMessage !== undefined && {
        welcomeMessage: updates.welcomeMessage,
      }),

      ...(updates.description !== undefined && {
        description: updates.description,
      }),

      ...(updates.callBackUrl !== undefined && {
        callBackUrl: updates.callBackUrl,
      }),

      ...(updates.successMessage !== undefined && {
        successMessage: updates.successMessage,
      }),

      ...(updates.whatsAppNumber !== undefined && {
        whatsAppNumber: updates.whatsAppNumber,
      }),

      ...(updates.phoneNumber !== undefined && {
        phoneNumber: updates.phoneNumber,
      }),

      ...(updates.email !== undefined && {
        email: updates.email,
      }),

      ...(updates.instagram !== undefined && {
        instagram: updates.instagram,
      }),

      ...(updates.facebook !== undefined && {
        facebook: updates.facebook,
      }),

      ...(updates.twitter !== undefined && {
        twitter: updates.twitter,
      }),

      ...(updates.storeProducts !== undefined && {
        products: [...updates.storeProducts],
      }),

      ...(updates.storeDiscounts !== undefined && {
        discounts: [...updates.storeDiscounts],
      }),
    };

    return updatedStore;
  });

  if (!updatedStore) {
    return undefined;
  }

  return {
    ...updatedStore,

    products: [...(updatedStore.products ?? [])],

    discounts: [...(updatedStore.discounts ?? [])],
  };
}

/**
 * ============================================================================
 * UPDATE STORE LAYOUT
 * ============================================================================
 */

export function updateMockStoreLayout(
  storeId: number,
  layout: StoreLayout
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    updatedStore = {
      ...store,

      layout,
    };

    return updatedStore;
  });

  if (!updatedStore) {
    return undefined;
  }

  return {
    ...updatedStore,

    products: [...(updatedStore.products ?? [])],

    discounts: [...(updatedStore.discounts ?? [])],
  };
}

/**
 * ============================================================================
 * DELETE STORE
 * ============================================================================
 */

export function deleteMockStore(storeId: number): boolean {
  const originalLength = mockStores.length;

  mockStores = mockStores.filter((store) => store.storeId !== storeId);

  return mockStores.length !== originalLength;
}

/**
 * ============================================================================
 * RESET MOCK STORES
 * ============================================================================
 */

export function resetMockStores(): void {
  mockStores = MOCK_STORES.map((store) => ({
    ...store,

    products: [...(store.products ?? [])],

    discounts: [...(store.discounts ?? [])],
  }));
}

/**
 * ============================================================================
 * STORE SUMMARY
 * ============================================================================
 */

export function getMockStoreSummaries(): StoreSummary[] {
  return mockStores.map((store) => ({
    storeId: store.storeId,

    storeName: store.storeName,

    storeReference: store.storeReference,

    currency: store.currency,

    isActive: store.isActive,
  }));
}

/**
 * ============================================================================
 * SHIPPING REGIONS
 * ============================================================================
 */

let mockShippingRegions: ShippingRegion[] = [];

/**
 * ============================================================================
 * GET SHIPPING REGIONS
 * ============================================================================
 */

export function getMockShippingRegions(): ShippingRegion[] {
  return mockShippingRegions.map((region) => ({
    ...region,
  }));
}

/**
 * ============================================================================
 * SAVE SHIPPING REGIONS
 * ============================================================================
 */

export function saveMockShippingRegions(regions: ShippingRegion[]): void {
  mockShippingRegions = regions.map((region) => ({
    ...region,
  }));
}
