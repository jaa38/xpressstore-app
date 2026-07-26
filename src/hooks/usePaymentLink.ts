import { create } from "zustand";

export type PaymentType = "one-time" | "subscription";

export interface PaymentLinkDraft {
  // Step 1
  linkName: string;
  amount: string;
  currency: string;
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
  paymentLink: PaymentLinkDraft;

  updatePaymentLink: (data: Partial<PaymentLinkDraft>) => void;

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
  paymentLink: initialState,

  updatePaymentLink: (data) =>
    set((state) => ({
      paymentLink: {
        ...state.paymentLink,
        ...data,
      },
    })),

  resetPaymentLink: () =>
    set({
      paymentLink: initialState,
    }),
}));
