import { create } from "zustand";

import type { Currency } from "@/types/currency";

export type PaymentType = "one-time" | "subscription";

export interface PaymentLinkDraft {
  // Step 1
  linkName: string;
  amount: string;
  currency: Currency;
  description: string;

  // Step 2
  expiryDate: Date | null;

  paymentType: PaymentType;

  allowMultiplePayments: boolean;

  collectCustomerName: boolean;

  collectCustomerEmail: boolean;

  redirectUrl: string;
}

interface PaymentLinkState {
  /**
   * Draft used by the payment link creation wizard.
   */
  paymentLink: PaymentLinkDraft;

  /**
   * Update one or more draft fields.
   */
  updatePaymentLink: (data: Partial<PaymentLinkDraft>) => void;

  /**
   * Reset the draft after a successful creation.
   */
  resetPaymentLink: () => void;
}

const initialState: PaymentLinkDraft = {
  // Step 1
  linkName: "",
  amount: "",
  currency: "NGN",
  description: "",

  // Step 2
  expiryDate: null,

  paymentType: "one-time",

  allowMultiplePayments: false,

  collectCustomerName: false,

  collectCustomerEmail: false,

  redirectUrl: "",
};

export const usePaymentLink = create<PaymentLinkState>((set) => ({
  /**
   * Current draft
   */
  paymentLink: initialState,

  /**
   * Update the draft
   */
  updatePaymentLink: (data) =>
    set((state) => ({
      paymentLink: {
        ...state.paymentLink,
        ...data,
      },
    })),

  /**
   * Reset the draft
   */
  resetPaymentLink: () =>
    set({
      paymentLink: initialState,
    }),
}));
