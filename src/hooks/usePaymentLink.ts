import { create } from "zustand";

export interface PaymentLinkDraft {
  linkName: string;
  amount: string;
  currency: string;
  description: string;

  expiryDate: Date | null;

  collectCustomerName: boolean;

  collectCustomerEmail: boolean;

  allowMultiplePayments: boolean;

  redirectUrl: string;
}

interface PaymentLinkState {
  paymentLink: PaymentLinkDraft;

  updatePaymentLink: (
    data: Partial<PaymentLinkDraft>
  ) => void;

  resetPaymentLink: () => void;
}

const initialState: PaymentLinkDraft = {
  linkName: "",
  amount: "",
  currency: "NGN",
  description: "",

  expiryDate: null,

  collectCustomerName: false,

  collectCustomerEmail: false,

  allowMultiplePayments: false,

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