import { useState, ReactNode } from "react";

import { ProductContext } from "./ProductContext";

import type { Product, ProductDraft } from "@/types/product";

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
  const [product, setProduct] = useState<ProductDraft>(INITIAL_PRODUCT);

  const [products, setProducts] = useState<Product[]>([]);

  function addProduct(newProduct: ProductDraft) {
    const publishedProduct: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };

    console.log("ADDING", publishedProduct);

    setProducts((current) => [...current, publishedProduct]);
  }

  function updateProduct(data: Partial<ProductDraft>) {
    setProduct((current) => {
      const next = {
        ...current,
        ...data,
      };

      if (data.dimensions) {
        next.dimensions = {
          ...current.dimensions,
          ...data.dimensions,
        };
      }

      if (data.variants) {
        next.variants = [...data.variants];
      }

      return next;
    });
  }

  function updatePublishedProduct(productId: string, data: Partial<Product>) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...data,
            }
          : product
      )
    );
  }

  function resetProduct() {
    setProduct(INITIAL_PRODUCT);
  }

  return (
    <ProductContext.Provider
      value={{
        product,
        products,
        updateProduct,
        addProduct,
        updatePublishedProduct,
        resetProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
