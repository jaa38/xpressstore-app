import { create } from "zustand";

import type { Currency } from "@/types/currency";
import type { PaymentLinkType } from "@/types/paymentLink";

export interface PaymentLinkDraft {
  /**
   * ---------------------------------------------------------------------------
   * Step 1 - Information
   * ---------------------------------------------------------------------------
   */

  linkName: string;

  amount: string;

  currency: Currency;

  description: string;

  /**
   * ---------------------------------------------------------------------------
   * Step 2 - Settings
   * ---------------------------------------------------------------------------
   */

  expiryDate: Date | null;

  pageType: PaymentLinkType;

  isFixedAmount: boolean;

  allowMultiplePayments: boolean;

  collectCustomerName: boolean;

  collectCustomerEmail: boolean;

  isPhoneNumberRequired: boolean;

  isTestMode: boolean;

  redirectUrl: string;

  subAccountId?: number;

  subAccountGroupId?: number;

  extraFields?: string;
}

interface PaymentLinkState {
  /**
   * Draft used throughout the payment link creation wizard.
   */
  paymentLink: PaymentLinkDraft;

  /**
   * Merge new values into the current draft.
   */
  updatePaymentLink: (data: Partial<PaymentLinkDraft>) => void;

  /**
   * Reset the draft after successful creation.
   */
  resetPaymentLink: () => void;
}

const initialState: PaymentLinkDraft = {
  /**
   * ---------------------------------------------------------------------------
   * Step 1
   * ---------------------------------------------------------------------------
   */

  linkName: "",

  amount: "",

  currency: "NGN",

  description: "",

  /**
   * ---------------------------------------------------------------------------
   * Step 2
   * ---------------------------------------------------------------------------
   */

  expiryDate: null,

  pageType: "single",

  isFixedAmount: true,

  allowMultiplePayments: false,

  collectCustomerName: false,

  collectCustomerEmail: false,

  isPhoneNumberRequired: false,

  isTestMode: false,

  redirectUrl: "",

  subAccountId: undefined,

  subAccountGroupId: undefined,

  extraFields: "",
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
