import { createContext } from "react";

import type {
  Product,
  ProductDraft,
} from "@/types/product";

export interface ProductContextType {
  product: ProductDraft;

  products: Product[];

  updateProduct: (
    data: Partial<ProductDraft>
  ) => void;

  addProduct: (
    product: ProductDraft
  ) => void;

  updatePublishedProduct: (
    productId: string,
    data: Partial<Product>
  ) => void;

  resetProduct: () => void;
}

export const ProductContext =
  createContext<ProductContextType | null>(
    null
  );