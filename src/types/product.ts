import type { ShippingClass } from "@/schemas/storefrontSchema";

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductDraft {
  productName: string;
  description: string;

  category: string;
  brand: string;
  sku: string;

  price: number;
  costPrice: number;

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

export interface ProductDimensions {
  weight: string;
  length: string;
  width: string;
  height: string;
}

// export type ShippingClass =
//   | "Standard"
//   | "Express"
//   | "Fragile"
//   | "Bulky"
//   | "Digital";
