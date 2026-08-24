// src/mocks/products.ts

import { getMockStore } from "@/mocks/stores";
import { MOCK_CATEGORIES } from "@/mocks/categories";

import type {
  MerchantProduct,
  ProductCategoryDto,
  CreateProductRequest,
} from "@/types/product";

import type { Currency } from "@/types/currency";

/**
 * ============================================================================
 * MOCK CATEGORY HELPER
 * ============================================================================
 */

function getMockCategory(categoryId: number): ProductCategoryDto {
  const category = MOCK_CATEGORIES.find((item) => item.id === categoryId);

  if (!category) {
    return {
      id: categoryId,
      name: "Other",
      description: "",
      isActive: true,
    };
  }

  return {
    id: category.id,
    name: category.name,
    description: "",
    isActive: true,
  };
}

/**
 * ============================================================================
 * MOCK PRODUCTS
 * ============================================================================
 */

export const MOCK_PRODUCTS: MerchantProduct[] = [
  /**
   * ==========================================================================
   * PRODUCT 1
   * ==========================================================================
   */

  {
    id: 1,

    productReference: "PROD-001",

    productName: "Classic Leather Sneakers",

    description:
      "Classic everyday leather sneakers designed for comfort and durability.",

    unitPrice: 85000,

    currency: "NGN",

    totalInStock: 18,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(3)],

    variations: [],

    productImages: [
      {
        filename: "classic-leather-sneakers.jpg",

        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 2
   * ==========================================================================
   */

  {
    id: 2,

    productReference: "PROD-002",

    productName: "Premium Ankara Tote Bag",

    description:
      "A stylish Ankara tote bag suitable for everyday shopping and casual use.",

    unitPrice: 45000,

    currency: "NGN",

    totalInStock: 4,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(2)],

    variations: [],

    productImages: [
      {
        filename: "premium-ankara-tote-bag.jpg",

        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 3
   * ==========================================================================
   */

  {
    id: 3,

    productReference: "PROD-003",

    productName: "Minimalist Wrist Watch",

    description: "Minimalist wrist watch featuring a clean and modern design.",

    unitPrice: 52500,

    currency: "NGN",

    totalInStock: 12,

    lowStockAlert: 4,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(5)],

    variations: [],

    productImages: [
      {
        filename: "minimalist-wrist-watch.jpg",

        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 4
   * ==========================================================================
   */

  {
    id: 4,

    productReference: "PROD-004",

    productName: "Premium Wireless Headphones",

    description:
      "Premium wireless headphones designed for music, calls and entertainment.",

    unitPrice: 125000,

    currency: "NGN",

    totalInStock: 2,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(4)],

    variations: [],

    productImages: [
      {
        filename: "premium-wireless-headphones.jpg",

        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 5
   * ==========================================================================
   */

  {
    id: 5,

    productReference: "PROD-005",

    productName: "Smart Travel Backpack",

    description:
      "Spacious travel backpack with dedicated compartments for everyday essentials.",

    unitPrice: 100000,

    currency: "NGN",

    totalInStock: 25,

    lowStockAlert: 5,

    inStock: true,

    isActive: false,

    productCategories: [getMockCategory(7)],

    variations: [],

    productImages: [
      {
        filename: "smart-travel-backpack.jpg",

        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 6
   * ==========================================================================
   */

  {
    id: 6,

    productReference: "PROD-006",

    productName: "Classic Cotton Shirt",

    description:
      "Comfortable cotton shirt suitable for casual and smart-casual outfits.",

    unitPrice: 22500,

    currency: "NGN",

    totalInStock: 3,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(1)],

    variations: [],

    productImages: [
      {
        filename: "classic-cotton-shirt.jpg",

        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 7
   * ==========================================================================
   */

  {
    id: 7,

    productReference: "PROD-007",

    productName: "Executive Office Chair",

    description:
      "Comfortable executive office chair designed for long working sessions.",

    unitPrice: 180000,

    currency: "NGN",

    totalInStock: 9,

    lowStockAlert: 3,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(6)],

    variations: [],

    productImages: [
      {
        filename: "executive-office-chair.jpg",

        url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 8
   * ==========================================================================
   */

  {
    id: 8,

    productReference: "PROD-008",

    productName: "Adjustable Laptop Stand",

    description: "Adjustable laptop stand designed to improve desk ergonomics.",

    unitPrice: 35000,

    currency: "NGN",

    totalInStock: 16,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(6)],

    variations: [],

    productImages: [
      {
        filename: "adjustable-laptop-stand.jpg",

        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 9
   * ==========================================================================
   */

  {
    id: 9,

    productReference: "PROD-009",

    productName: "Wireless Keyboard",

    description:
      "Compact wireless keyboard suitable for work and everyday computing.",

    unitPrice: 60000,

    currency: "NGN",

    totalInStock: 7,

    lowStockAlert: 3,

    inStock: true,

    isActive: false,

    productCategories: [getMockCategory(4)],

    variations: [],

    productImages: [
      {
        filename: "wireless-keyboard.jpg",

        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 10
   * ==========================================================================
   */

  {
    id: 10,

    productReference: "PROD-010",

    productName: "Premium Crossbody Bag",

    description:
      "Premium crossbody bag combining practical storage with a modern design.",

    unitPrice: 69000,

    currency: "NGN",

    totalInStock: 22,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(2)],

    variations: [],

    productImages: [
      {
        filename: "premium-crossbody-bag.jpg",

        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 11
   * ==========================================================================
   */

  {
    id: 11,

    productReference: "PROD-011",

    productName: "Fashion Sunglasses",

    description: "Modern fashion sunglasses designed for everyday wear.",

    unitPrice: 25000,

    currency: "NGN",

    totalInStock: 1,

    lowStockAlert: 5,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(5)],

    variations: [],

    productImages: [
      {
        filename: "fashion-sunglasses.jpg",

        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
      },
    ],
  },

  /**
   * ==========================================================================
   * PRODUCT 12
   * ==========================================================================
   */

  {
    id: 12,

    productReference: "PROD-012",

    productName: "Modern Canvas Backpack",

    description:
      "Durable canvas backpack suitable for work, school and everyday travel.",

    unitPrice: 55000,

    currency: "NGN",

    totalInStock: 14,

    lowStockAlert: 4,

    inStock: true,

    isActive: true,

    productCategories: [getMockCategory(7)],

    variations: [],

    productImages: [
      {
        filename: "modern-canvas-backpack.jpg",

        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      },
    ],
  },
];

/**
 * ============================================================================
 * MOCK REPOSITORY
 * ============================================================================
 */

let mockProducts: MerchantProduct[] = MOCK_PRODUCTS.map((product) => ({
  ...product,

  productImages:
    product.productImages?.map((image) => ({
      ...image,
    })) ?? [],

  productCategories:
    product.productCategories?.map((category) => ({
      ...category,
    })) ?? [],
}));

/**
 * ============================================================================
 * GET ALL PRODUCTS
 * ============================================================================
 */

export function getMockProducts(): MerchantProduct[] {
  return [...mockProducts];
}

/**
 * ============================================================================
 * GET PRODUCTS BY STORE
 * ============================================================================
 */

export function getMockProductsByStore(storeId: number): MerchantProduct[] {
  const store = getMockStore(storeId);

  if (!store) {
    return [];
  }

  const productIds = store.products ?? [];

  return productIds
    .map((productId) => getMockProduct(productId))
    .filter((product): product is MerchantProduct => product !== undefined)
    .map((product) => ({
      ...product,

      productImages:
        product.productImages?.map((image) => ({
          ...image,
        })) ?? [],

      productCategories:
        product.productCategories?.map((category) => ({
          ...category,
        })) ?? [],
    }));
}

/**
 * ============================================================================
 * GET PRODUCT
 * ============================================================================
 */

export function getMockProduct(productId: number): MerchantProduct | undefined {
  return mockProducts.find((product) => product.id === productId);
}

/**
 * ============================================================================
 * CREATE PRODUCT
 * ============================================================================
 */

export function createMockProduct(
  payload: CreateProductRequest
): MerchantProduct {
  /**
   * ==========================================================================
   * GENERATE PRODUCT ID
   * ==========================================================================
   */

  const nextId =
    mockProducts.length > 0
      ? Math.max(...mockProducts.map((product) => product.id)) + 1
      : 1;

  /**
   * ==========================================================================
   * GENERATE PRODUCT REFERENCE
   * ==========================================================================
   */

  const productReference = `MOCK-${String(nextId).padStart(4, "0")}`;

  /**
   * ==========================================================================
   * CURRENCY
   * ==========================================================================
   *
   * CreateProductRequest currently exposes currency as a string.
   *
   * MerchantProduct requires the stricter Currency type.
   */

  const currency = payload.currency as Currency;

  /**
   * ==========================================================================
   * CATEGORIES
   * ==========================================================================
   *
   * Convert category IDs into the same ProductCategoryDto structure
   * used by the existing mock products.
   *
   * This also means the Review screen will display:
   *
   *     Category: Fashion
   *
   * instead of:
   *
   *     Category: 1
   */

  const productCategories: ProductCategoryDto[] =
    payload.categoryIds?.map((categoryId) =>
      getMockCategory(Number(categoryId))
    ) ?? [];

  /**
   * ==========================================================================
   * PRODUCT IMAGES
   * ==========================================================================
   */

  const productImages = payload.images ?? [];

  /**
   * ==========================================================================
   * BUILD PRODUCT
   * ==========================================================================
   */

  const createdProduct: MerchantProduct = {
    id: nextId,

    productReference,

    productName: payload.name,

    description: payload.description,

    unitPrice: Number(payload.price),

    currency,

    inStock: true,

    totalInStock: 0,

    lowStockAlert: 0,

    isActive: Boolean(payload.publishNow),

    youtubeLink: payload.youtubeLink ?? "",

    unit: payload.unit ?? "",

    productLocation: payload.productLocation ?? "",

    minOrderQty: payload.minOrderQty ?? "",

    productImages,

    productCategories,

    variations: [],
  };

  /**
   * ==========================================================================
   * SAVE TO MOCK REPOSITORY
   * ==========================================================================
   *
   * Add the newly created product to the beginning of the repository so it
   * immediately appears at the top of the product list.
   */

  mockProducts = [createdProduct, ...mockProducts];

  return createdProduct;
}

/**
 * ============================================================================
 * UPDATE PRODUCT
 * ============================================================================
 */

export function updateMockProduct(
  productId: number,
  updates: Partial<MerchantProduct>
): MerchantProduct | undefined {
  let updatedProduct: MerchantProduct | undefined;

  mockProducts = mockProducts.map((product) => {
    if (product.id !== productId) {
      return product;
    }

    updatedProduct = {
      ...product,

      ...updates,

      productImages: updates.productImages ?? product.productImages,

      productCategories: updates.productCategories ?? product.productCategories,

      /**
       * Keep inStock consistent with totalInStock.
       */
      inStock:
        updates.totalInStock !== undefined
          ? updates.totalInStock > 0
          : product.inStock,
    };

    return updatedProduct;
  });

  return updatedProduct;
}

/**
 * ============================================================================
 * DELETE PRODUCT
 * ============================================================================
 */

export function deleteMockProduct(productId: number): boolean {
  const previousLength = mockProducts.length;

  mockProducts = mockProducts.filter((product) => product.id !== productId);

  return mockProducts.length < previousLength;
}

/**
 * ============================================================================
 * TOGGLE PRODUCT STATUS
 * ============================================================================
 */

export function toggleMockProductStatus(
  productId: number,
  isActive: boolean
): MerchantProduct | undefined {
  return updateMockProduct(productId, {
    isActive,
  });
}

/**
 * ============================================================================
 * RESET MOCK PRODUCTS
 * ============================================================================
 */

export function resetMockProducts(): void {
  mockProducts = MOCK_PRODUCTS.map((product) => ({
    ...product,

    productImages:
      product.productImages?.map((image) => ({
        ...image,
      })) ?? [],

    productCategories:
      product.productCategories?.map((category) => ({
        ...category,
      })) ?? [],
  }));
}
