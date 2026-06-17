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

  stock: number;
  lowStockAlert: number;
  reorderLevel: number;

  image: string;
  images: string[];

  visible: boolean;

  shippingClass: string;

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