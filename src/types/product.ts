import type { ShippingClass } from "@/schemas/storefrontSchema";

import type { Currency } from "./currency";

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
