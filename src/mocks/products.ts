// src/mocks/products.ts

import type { MerchantProduct } from "@/types/product";

/**
 * ============================================================================
 * MOCK PRODUCTS
 * ============================================================================
 *
 * This file is only used when mock mode is enabled.
 *
 * It does NOT modify or replace any API service.
 *
 * The mock repository acts as the temporary source of truth while developing
 * the UI without a backend.
 */

export const MOCK_PRODUCTS: MerchantProduct[] = [
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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "classic-leather-sneakers.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-ankara-tote-bag.jpg",
        url: "",
      },
    ],
  },

  {
    id: 3,
    productReference: "PROD-003",
    productName: "Minimalist Wrist Watch",
    description:
      "Minimalist wrist watch featuring a clean and modern design.",
    unitPrice: 52500,
    currency: "NGN",
    totalInStock: 12,
    lowStockAlert: 4,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "minimalist-wrist-watch.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-wireless-headphones.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "smart-travel-backpack.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "classic-cotton-shirt.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "executive-office-chair.jpg",
        url: "",
      },
    ],
  },

  {
    id: 8,
    productReference: "PROD-008",
    productName: "Adjustable Laptop Stand",
    description:
      "Adjustable laptop stand designed to improve desk ergonomics.",
    unitPrice: 35000,
    currency: "NGN",
    totalInStock: 16,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "adjustable-laptop-stand.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "wireless-keyboard.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-crossbody-bag.jpg",
        url: "",
      },
    ],
  },

  {
    id: 11,
    productReference: "PROD-011",
    productName: "Fashion Sunglasses",
    description:
      "Modern fashion sunglasses designed for everyday wear.",
    unitPrice: 25000,
    currency: "NGN",
    totalInStock: 1,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "fashion-sunglasses.jpg",
        url: "",
      },
    ],
  },

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
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "modern-canvas-backpack.jpg",
        url: "",
      },
    ],
  },
];

/**
 * ============================================================================
 * MOCK REPOSITORY
 * ============================================================================
 *
 * Keep a module-level copy so both:
 *
 * app/(tabs)/products.tsx
 *
 * and
 *
 * app/product/[id].tsx
 *
 * work with the same data.
 */

let mockProducts: MerchantProduct[] = MOCK_PRODUCTS.map(
  (product) => ({
    ...product,
    productImages:
      product.productImages?.map(
        (image) => ({
          ...image,
        })
      ) ?? [],
  })
);

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
 * GET PRODUCT
 * ============================================================================
 */

export function getMockProduct(
  productId: number
): MerchantProduct | undefined {
  return mockProducts.find(
    (product) =>
      product.id === productId
  );
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
  let updatedProduct:
    | MerchantProduct
    | undefined;

  mockProducts = mockProducts.map(
    (product) => {
      if (product.id !== productId) {
        return product;
      }

      updatedProduct = {
        ...product,
        ...updates,

        /**
         * Keep inStock consistent with
         * totalInStock.
         */
        inStock:
          updates.totalInStock !==
          undefined
            ? updates.totalInStock > 0
            : product.inStock,
      };

      return updatedProduct;
    }
  );

  return updatedProduct;
}

/**
 * ============================================================================
 * DELETE PRODUCT
 * ============================================================================
 */

export function deleteMockProduct(
  productId: number
): boolean {
  const previousLength =
    mockProducts.length;

  mockProducts =
    mockProducts.filter(
      (product) =>
        product.id !== productId
    );

  return (
    mockProducts.length <
    previousLength
  );
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
  return updateMockProduct(
    productId,
    {
      isActive,
    }
  );
}

/**
 * ============================================================================
 * RESET MOCK PRODUCTS
 * ============================================================================
 */

export function resetMockProducts(): void {
  mockProducts =
    MOCK_PRODUCTS.map(
      (product) => ({
        ...product,

        productImages:
          product.productImages?.map(
            (image) => ({
              ...image,
            })
          ) ?? [],
      })
    );
}