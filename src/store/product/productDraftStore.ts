import { create } from "zustand";

import type { ProductDraft } from "@/types/product";

const INITIAL_PRODUCT: ProductDraft = {
  productName: "",
  description: "",

  category: "",
  brand: "",
  sku: "",

  price: 0,
  costPrice: 0,

  currency: "NGN",

  taxApplicable: false,

  trackInventory: true,

  productStatus: "active",

  stock: 0,
  lowStockAlert: 0,
  reorderLevel: 0,

  image: "",
  images: [],

  visible: true,

  storeIds: [],

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

interface ProductDraftStore {
  product: ProductDraft;

  updateProduct: (data: Partial<ProductDraft>) => void;

  resetProduct: () => void;
}

export const useProductDraftStore = create<ProductDraftStore>((set) => ({
  product: INITIAL_PRODUCT,

  updateProduct: (data) =>
    set((state) => ({
      product: {
        ...state.product,
        ...data,

        dimensions: data.dimensions
          ? {
              ...state.product.dimensions,
              ...data.dimensions,
            }
          : state.product.dimensions,

        variants: data.variants ? [...data.variants] : state.product.variants,
      },
    })),

  resetProduct: () =>
    set({
      product: INITIAL_PRODUCT,
    }),
}));
