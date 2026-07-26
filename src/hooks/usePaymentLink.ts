import { create } from "zustand";

import type { Currency } from "@/types/currency";
import type { PaymentLink } from "@/types/paymentLink";

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
   * Draft used by the payment link creation wizard
   */
  paymentLink: PaymentLinkDraft;

  /**
   * Created payment links
   */
  paymentLinks: PaymentLink[];

  updatePaymentLink: (
    data: Partial<PaymentLinkDraft>
  ) => void;

  addPaymentLink: (
    paymentLink: PaymentLink
  ) => void;

  removePaymentLink: (
    id: string
  ) => void;

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

const initialPaymentLinks: PaymentLink[] = [];

export const usePaymentLink = create<PaymentLinkState>((set) => ({
  /**
   * Current draft
   */
  paymentLink: initialState,

  /**
   * Created payment links
   */
  paymentLinks: initialPaymentLinks,

  updatePaymentLink: (data) =>
    set((state) => ({
      paymentLink: {
        ...state.paymentLink,
        ...data,
      },
    })),

  addPaymentLink: (paymentLink) =>
    set((state) => ({
      paymentLinks: [
        paymentLink,
        ...state.paymentLinks,
      ],
    })),

  removePaymentLink: (id) =>
    set((state) => ({
      paymentLinks: state.paymentLinks.filter(
        (link) => link.id !== id
      ),
    })),

  resetPaymentLink: () =>
    set({
      paymentLink: initialState,
    }),
}));