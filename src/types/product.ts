export interface ProductDraft {
  productName: string;
  description: string;
  category: string;
  brand: string;
  sku: string;

  price: number;
  stock: number;

//   variants: ProductVariant[];

  visible: boolean;

  images: string[];
}