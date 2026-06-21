import { useState, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ProductContext } from "./ProductContext";

import type { Product, ProductDraft } from "@/types/product";

const PRODUCTS_STORAGE_KEY = "products";

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

  // ─────────────────────────────
  // LOAD SAVED PRODUCTS
  // ─────────────────────────────

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Failed to load products", error);
    }
  }

  // ─────────────────────────────
  // SAVE PRODUCTS
  // ─────────────────────────────

  useEffect(() => {
    saveProducts();
  }, [products]);

  async function saveProducts() {
    try {
      await AsyncStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
      );
    } catch (error) {
      console.error("Failed to save products", error);
    }
  }

  // ─────────────────────────────
  // ADD PRODUCT
  // ─────────────────────────────

  function addProduct(newProduct: ProductDraft) {
    const publishedProduct: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };

    setProducts((current) => [...current, publishedProduct]);
  }

  // ─────────────────────────────
  // UPDATE DRAFT PRODUCT
  // ─────────────────────────────

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

  // ─────────────────────────────
  // UPDATE PUBLISHED PRODUCT
  // ─────────────────────────────

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

  // ─────────────────────────────
  // RESET DRAFT
  // ─────────────────────────────

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
