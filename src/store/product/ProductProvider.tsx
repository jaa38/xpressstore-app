import { useState, ReactNode } from "react";

import { ProductContext } from "./ProductContext";

import { ProductDraft } from "@/types/product";

const INITIAL_PRODUCT: ProductDraft = {
  productName: "",
  description: "",

  category: "",
  brand: "",
  sku: "",

  price: 0,
  costPrice: 0,

  taxApplicable: false,

  trackInventory: true,

  productStatus: "active",

  stock: 0,
  lowStockAlert: 0,
  reorderLevel: 0,

  image: "",
  images: [],

  visible: true,

  dimensions: {
    weight: "",
    length: "",
    width: "",
    height: "",
  },

  shippingClass: "Standard",

  deliveryNotes: "",

  variantsEnabled: false,

  variants: [],
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState(INITIAL_PRODUCT);

  function updateProduct(data: Partial<ProductDraft>) {
    setProduct((current) => ({
      ...current,
      ...data,
    }));
  }

  function resetProduct() {
    setProduct(INITIAL_PRODUCT);
  }

  return (
    <ProductContext.Provider
      value={{
        product,
        updateProduct,
        resetProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
