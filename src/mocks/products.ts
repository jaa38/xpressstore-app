import type {
  CreateProductRequest,
  MerchantProduct,
  ProductCategoryDto,
  ProductImageDto,
  ProductVariationDto,
} from "@/types/product";

import {
  getMockCategory,
  getMockCategories,
} from "@/mocks/productCategories";

import {
  getMockStore,
} from "@/mocks/stores";

/**
 * ============================================================================
 * MOCK PRODUCTS
 * ============================================================================
 */

const MOCK_PRODUCTS: MerchantProduct[] = [
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

    soldOutLevel: 0,

    inStock: true,

    isActive: true,

    productCategories: [],

    variations: [],

    productImages: [
      {
        filename: "classic-leather-sneakers.jpg",

        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      },
    ],
  },

  {
    id: 2,

    productReference: "PROD-002",

    productName: "Premium Cotton T-Shirt",

    description:
      "Premium cotton t-shirt designed for everyday comfort and casual wear.",

    unitPrice: 22500,

    currency: "NGN",

    totalInStock: 3,

    lowStockAlert: 5,

    soldOutLevel: 0,

    inStock: true,

    isActive: true,

    productCategories: [],

    variations: [],

    productImages: [
      {
        filename: "premium-cotton-tshirt.jpg",

        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      },
    ],
  },

  {
    id: 3,

    productReference: "PROD-003",

    productName: "Smart Fitness Watch",

    description:
      "Smart fitness watch with activity tracking, notifications and health monitoring features.",

    unitPrice: 125000,

    currency: "NGN",

    totalInStock: 12,

    lowStockAlert: 5,

    soldOutLevel: 0,

    inStock: true,

    isActive: true,

    productCategories: [],

    variations: [],

    productImages: [
      {
        filename: "smart-fitness-watch.jpg",

        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
    ],
  },

  {
    id: 4,

    productReference: "PROD-004",

    productName: "Wireless Headphones",

    description:
      "Wireless headphones with a comfortable fit and high-quality audio.",

    unitPrice: 95000,

    currency: "NGN",

    totalInStock: 8,

    lowStockAlert: 4,

    soldOutLevel: 0,

    inStock: true,

    isActive: true,

    productCategories: [],

    variations: [],

    productImages: [
      {
        filename: "wireless-headphones.jpg",

        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      },
    ],
  },

  {
    id: 5,

    productReference: "PROD-005",

    productName: "Minimalist Backpack",

    description:
      "Minimalist backpack suitable for work, school and everyday travel.",

    unitPrice: 65000,

    currency: "NGN",

    totalInStock: 6,

    lowStockAlert: 5,

    soldOutLevel: 0,

    inStock: true,

    isActive: true,

    productCategories: [],

    variations: [],

    productImages: [
      {
        filename: "minimalist-backpack.jpg",

        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      },
    ],
  },

  {
    id: 6,

    productReference: "PROD-006",

    productName: "Classic Cotton Shirt",

    description:
      "Classic cotton shirt suitable for casual and smart-casual occasions.",

    unitPrice: 22500,

    currency: "NGN",

    totalInStock: 3,

    lowStockAlert: 5,

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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

    soldOutLevel: 0,

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
 * GET PRODUCTS BY STORE
 * ============================================================================
 *
 * Returns the products currently assigned to a store.
 *
 * The store owns the product relationship through its `products` array.
 * This repository resolves those product IDs into MerchantProduct objects.
 *
 * This mirrors:
 *
 * productService.getProductsByStore(storeId)
 * ============================================================================
 */

export function getMockProductsByStore(
  storeId: number
): MerchantProduct[] {
  const store = getMockStore(storeId);

  if (!store) {
    return [];
  }

  const productIds = store.products ?? [];

  return productIds
    .map((productId) =>
      getMockProduct(productId)
    )
    .filter(
      (
        product
      ): product is MerchantProduct =>
        product !== undefined
    )
    .map((product) => ({
      ...product,

      productImages:
        product.productImages?.map(
          (image) => ({
            ...image,
          })
        ) ?? [],
    }));
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
         * totalInStock and soldOutLevel.
         */
        inStock:
          updates.totalInStock !== undefined ||
          updates.soldOutLevel !== undefined
            ? (
                updates.totalInStock ??
                product.totalInStock
              ) >
              (
                updates.soldOutLevel ??
                product.soldOutLevel
              )
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
 * CREATE PRODUCT
 * ============================================================================
 */

export function createMockProduct(
  payload: CreateProductRequest
): MerchantProduct {
  const existingIds = mockProducts.map(
    (product) => product.id
  );

  const nextId =
    existingIds.length > 0
      ? Math.max(...existingIds) + 1
      : 1;

  const productReference =
    `PROD-${String(nextId).padStart(3, "0")}`;

  const totalInStock =
    Number(payload.stock ?? 0);

  const lowStockAlert =
    Number(
      payload.lowStockAlert ?? 0
    );

  const soldOutLevel =
    Number(
      payload.soldOutLevel ?? 0
    );

  const productImages =
    payload.images?.map(
      (image) => ({
        ...image,
      })
    ) ?? [];

  const productCategories: ProductCategoryDto[] =
    payload.categoryIds?.map(
      (categoryId) => {
        const category =
          getMockCategory(categoryId);

        if (category) {
          return category;
        }

        return {
          id: categoryId,

          name: `Category ${categoryId}`,

          description: "",

          isActive: true,
        };
      }
    ) ?? [];

  const variations: ProductVariationDto[] =
    payload.variations?.map(
      (variation) => ({
        ...variation,

        options:
          variation.options ?? [],
      })
    ) ?? [];

  const createdProduct: MerchantProduct = {
    id: nextId,

    productReference,

    productName:
      payload.name,

    description:
      payload.description,

    unitPrice:
      Number(payload.price),

    currency:
      payload.currency as MerchantProduct["currency"],

    totalInStock,

    lowStockAlert,

    soldOutLevel,

    inStock:
      totalInStock >
      soldOutLevel,

    isActive:
      Boolean(
        payload.publishNow
      ),

    youtubeLink:
      payload.youtubeLink ?? "",

    unit:
      payload.unit ?? "",

    productLocation:
      payload.productLocation ?? "",

    minOrderQty:
      payload.minOrderQty ?? "",

    productImages,

    productCategories,

    variations,
  };

  mockProducts = [
    ...mockProducts,
    createdProduct,
  ];

  return createdProduct;
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