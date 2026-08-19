import { create } from "zustand";

import type { Currency } from "@/types/currency";

/**
 * ============================================================================
 * Store Draft
 * ============================================================================
 *
 * Holds the Store creation data while the merchant moves through the
 * multi-step Store creation wizard.
 * ============================================================================
 */

export interface StoreDraft {
  /**
   * Step 1 — Information
   */
  storeName: string;

  storeReference: string;

  currency: Currency;

  description: string;

  welcomeMessage: string;

  /**
   * Generated storefront URL.
   */
  storeLink: string;

  /**
   * Step 2 — Products
   */
  storeProducts: number[];

  /**
   * Step 3 — Shipping
   */
  storeShippingRegion: number[];

  /**
   * Reserved for future discount selection.
   */
  storeDiscounts: number[];
}

interface StoreDraftState {
  store: StoreDraft;

  updateStore: (data: Partial<StoreDraft>) => void;

  resetStore: () => void;
}

const initialState: StoreDraft = {
  storeName: "",

  storeReference: "",

  currency: "NGN",

  description: "",

  welcomeMessage: "",

  storeLink: "",

  storeProducts: [],

  storeShippingRegion: [],

  storeDiscounts: [],
};

export const useStoreDraft = create<StoreDraftState>((set) => ({
  store: initialState,

  updateStore: (data) =>
    set((state) => ({
      store: {
        ...state.store,
        ...data,
      },
    })),

  resetStore: () =>
    set({
      store: initialState,
    }),
}));