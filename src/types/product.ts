import type { ShippingClass } from "@/schemas/storefrontSchema";
import type { Currency } from "./currency";

/**
 * ============================================================================
 * UI MODELS
 * ============================================================================
 */

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductDimensions {
  weight: string;
  length: string;
  width: string;
  height: string;
}

export interface ProductDraft {
  productName: string;

  description: string;

  category: string;

  brand: string;

  sku: string;

  price: number;

  costPrice: number;

  currency: Currency;

  taxApplicable: boolean;

  trackInventory: boolean;

  productStatus: "active" | "draft";

  stock: number;

  lowStockAlert: number;

  reorderLevel: number;

  image: string;

  images: string[];

  visible: boolean;

  shippingClass: ShippingClass;

  deliveryNotes: string;

  dimensions: ProductDimensions;

  variantsEnabled: boolean;

  variants: ProductVariant[];
}

export interface Product extends ProductDraft {
  id: string;
}

/**
 * ============================================================================
 * API DTOs
 * ============================================================================
 */

export interface ProductImageDto {
  filename: string;

  url: string;
}

export interface ProductOptionDto {
  name: string;

  values: string[];
}

export interface ProductVariationDto {
  name: string;

  options: string[];
}

export interface CreateProductRequest {
  id: number;

  name: string;

  description: string;

  youtubeLink?: string;

  currency: string;

  price: number;

  unit?: string;

  productLocation?: string;

  minOrderQty?: string;

  hasVariants: boolean;

  images: ProductImageDto[];

  categoryIds: number[];

  variations: ProductVariationDto[];

  options: ProductOptionDto[];

  publishNow: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {}

export interface MerchantProduct {
  id: number;

  productReference: string;

  productName: string;

  description: string;

  unitPrice: number;

  currency: string;

  inStock: boolean;

  totalInStock: number;

  lowStockAlert: number;

  isActive: boolean;

  youtubeLink?: string;

  unit?: string;

  productLocation?: string;

  minOrderQty?: string;

  productImages: ProductImageDto[];

  productCategories: unknown[];

  variations: ProductVariationDto[];
}

export interface UploadProductImageResponse {
  filename: string;

  url: string;
}

/**
 * ============================================================================
 * UI VIEW MODELS
 * ============================================================================
 */

export interface EditProduct extends MerchantProduct {
  /**
   * UI-friendly aliases
   */
  category: string;

  image: string;

  price: number;

  stock: number;

  visible: boolean;
}
