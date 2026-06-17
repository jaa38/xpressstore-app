import { createContext } from "react";

import { ProductDraft } from "@/types/product";

export interface ProductContextType {
  product: ProductDraft;

  updateProduct: (
    data: Partial<ProductDraft>
  ) => void;

  resetProduct: () => void;
}

export const ProductContext =
  createContext<ProductContextType | null>(
    null
  );