import type {
  CreateShippingRegionRequest,
  CreateStoreRequest,
  ShippingRegion,
  Store,
  StoreLayout,
  StoreSummary,
  StoreAvailabilityResponse,
  UpdateShippingRegionRequest,
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

    discounts: ["disc-001"],
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

    discounts: ["disc-002"],
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

    discounts: ["disc-003"],
  },
];

/**
 * ============================================================================
 * MOCK STORE SHIPPING REGIONS
 * ============================================================================
 *
 * Stores the shipping-region IDs assigned to each mock store.
 *
 * This keeps the relationship separate from the Store response model because
 * the current Store API model does not expose shipping regions directly.
 * ============================================================================
 */

let mockStoreShippingRegions: Record<number, number[]> = {};

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
 * CREATE STORE
 * ============================================================================
 */

export function createMockStore(payload: CreateStoreRequest): Store {
  const nextStoreId =
    mockStores.length > 0
      ? Math.max(...mockStores.map((store) => store.storeId)) + 1
      : 1;

  const newStore: Store = {
    storeId: nextStoreId,

    storeName: payload.storeName,

    storeReference: payload.storeReference,

    storeLink: payload.storeLink,

    currency: payload.currency,

    welcomeMessage: payload.welcomeMessage,

    description: payload.description,

    isActive: true,

    themeColor: "#0F4082",

    layout: "grid",

    products: [...(payload.storeProducts ?? [])],

    discounts: [...(payload.storeDiscounts ?? [])],
  };

  mockStores = [...mockStores, newStore];

  mockStoreShippingRegions[nextStoreId] = [
    ...(payload.storeShippingRegion ?? []),
  ];

  return {
    ...newStore,

    products: [...(newStore.products ?? [])],

    discounts: [...(newStore.discounts ?? [])],
  };
}

/**
 * ============================================================================
 * GET STORE SHIPPING REGIONS
 * ============================================================================
 */

export function getMockStoreShippingRegions(storeId: number): number[] {
  return [...(mockStoreShippingRegions[storeId] ?? [])];
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
 * ADD DISCOUNT TO STORE
 * ============================================================================
 *
 * Adds a discount ID to a store.
 *
 * Discount IDs are strings because they follow the Discount API contract.
 *
 * A discount will not be added twice.
 * ============================================================================
 */

export function addMockDiscountToStore(
  storeId: number,
  discountId: string
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    const discounts = store.discounts ?? [];

    /**
     * Discount already assigned.
     *
     * Do not create a duplicate relationship.
     */
    if (discounts.includes(discountId)) {
      updatedStore = {
        ...store,

        products: [...(store.products ?? [])],

        discounts: [...discounts],
      };

      return updatedStore;
    }

    updatedStore = {
      ...store,

      products: [...(store.products ?? [])],

      discounts: [...discounts, discountId],
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
 * REMOVE DISCOUNT FROM STORE
 * ============================================================================
 *
 * Removes a discount ID from a store.
 * ============================================================================
 */

export function removeMockDiscountFromStore(
  storeId: number,
  discountId: string
): Store | undefined {
  let updatedStore: Store | undefined;

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    const discounts = store.discounts ?? [];

    updatedStore = {
      ...store,

      products: [...(store.products ?? [])],

      discounts: discounts.filter((id) => id !== discountId),
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
 * SET STORE DISCOUNTS
 * ============================================================================
 *
 * Replaces the complete discount assignment for a store.
 *
 * This mirrors the UpdateStore API's:
 *
 * storeDiscounts?: string[]
 *
 * Duplicate IDs are removed.
 * ============================================================================
 */

export function setMockStoreDiscounts(
  storeId: number,
  discountIds: string[]
): Store | undefined {
  let updatedStore: Store | undefined;

  const uniqueDiscountIds = [...new Set(discountIds)];

  mockStores = mockStores.map((store) => {
    if (store.storeId !== storeId) {
      return store;
    }

    updatedStore = {
      ...store,

      products: [...(store.products ?? [])],

      discounts: [...uniqueDiscountIds],
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

const MOCK_SHIPPING_REGIONS: ShippingRegion[] = [
  {
    id: 1,
    region: "Lagos",
    state: "Lagos",
    shippingFee: 3000,
  },

  {
    id: 2,
    region: "South West",
    state: "Ogun",
    shippingFee: 4500,
  },

  {
    id: 3,
    region: "FCT",
    state: "Abuja",
    shippingFee: 5000,
  },

  {
    id: 4,
    region: "South East",
    state: "Anambra",
    shippingFee: 5500,
  },

  {
    id: 5,
    region: "South South",
    state: "Rivers",
    shippingFee: 6000,
  },
];

let mockShippingRegions: ShippingRegion[] = MOCK_SHIPPING_REGIONS.map(
  (region) => ({
    ...region,
  })
);

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

/**
 * ============================================================================
 * CREATE SHIPPING REGION
 * ============================================================================
 */

export function createMockShippingRegion(
  payload: CreateShippingRegionRequest
): ShippingRegion {
  const nextId =
    mockShippingRegions.length > 0
      ? Math.max(...mockShippingRegions.map((region) => region.id)) + 1
      : 1;

  const newRegion: ShippingRegion = {
    id: nextId,

    region: payload.region,

    state: payload.state,

    shippingFee: payload.shippingFee,
  };

  mockShippingRegions = [...mockShippingRegions, newRegion];

  return {
    ...newRegion,
  };
}

/**
 * ============================================================================
 * UPDATE SHIPPING REGION
 * ============================================================================
 */

export function updateMockShippingRegion(
  payload: UpdateShippingRegionRequest
): ShippingRegion | undefined {
  let updatedRegion: ShippingRegion | undefined;

  mockShippingRegions = mockShippingRegions.map((region) => {
    if (region.id !== payload.id) {
      return region;
    }

    updatedRegion = {
      ...region,

      region: payload.region,

      state: payload.state,

      shippingFee: payload.shippingFee,
    };

    return updatedRegion;
  });

  if (!updatedRegion) {
    return undefined;
  }

  return {
    ...updatedRegion,
  };
}

/**
 * ============================================================================
 * DELETE SHIPPING REGION
 * ============================================================================
 */

export function deleteMockShippingRegion(regionId: number): boolean {
  const originalLength = mockShippingRegions.length;

  mockShippingRegions = mockShippingRegions.filter(
    (region) => region.id !== regionId
  );

  return mockShippingRegions.length !== originalLength;
}

/**
 * ============================================================================
 * RESET SHIPPING REGIONS
 * ============================================================================
 */

export function resetMockShippingRegions(): void {
  mockShippingRegions = MOCK_SHIPPING_REGIONS.map((region) => ({
    ...region,
  }));
}

/**
 * ============================================================================
 * VALIDATE STORE NAME
 * ============================================================================
 */

export function validateMockStoreName(
  storeName: string
): StoreAvailabilityResponse {
  const normalizedName = storeName.trim().toLowerCase();

  const isAvailable =
    normalizedName.length > 0 &&
    !mockStores.some(
      (store) => store.storeName.trim().toLowerCase() === normalizedName
    );

  return {
    isAvailable,
  };
}

/**
 * ============================================================================
 * VALIDATE STORE REFERENCE
 * ============================================================================
 */

export function validateMockStoreReference(
  reference: string
): StoreAvailabilityResponse {
  const normalizedReference = reference.trim().toLowerCase();

  const isAvailable =
    normalizedReference.length > 0 &&
    !mockStores.some(
      (store) =>
        store.storeReference.trim().toLowerCase() === normalizedReference
    );

  return {
    isAvailable,
  };
}
