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

  /**
   * Future backend field.
   *
   * Retained in the creation UI/draft but is not currently sent to the
   * Payment Pages API.
   */
  expiryDate: Date | null;

  /**
   * Backend-supported Payment Page type.
   *
   * Current documented values:
   *
   * - single
   * - donation
   */
  pageType: PaymentLinkType;

  /**
   * Future backend field.
   *
   * Retained in the UI/draft but is not currently sent to the
   * Payment Pages API.
   */
  paymentType:
    | "one-time"
    | "subscription";

  /**
   * Backend-supported field.
   */
  isFixedAmount: boolean;

  /**
   * Future backend field.
   *
   * Retained in the creation UI/draft but is not currently sent to the
   * Payment Pages API.
   */
  allowMultiplePayments: boolean;

  /**
   * Future backend field.
   *
   * Retained in the creation UI/draft but is not currently sent to the
   * Payment Pages API.
   */
  collectCustomerName: boolean;

  /**
   * Future backend field.
   *
   * Retained in the creation UI/draft but is not currently sent to the
   * Payment Pages API.
   */
  collectCustomerEmail: boolean;

  /**
   * Backend-supported field.
   */
  isPhoneNumberRequired: boolean;

  /**
   * Backend-supported field.
   */
  isTestMode: boolean;

  /**
   * Backend-supported field.
   */
  redirectUrl: string;

  /**
   * Backend-supported optional field.
   *
   * The Payment Pages API documents this as a string.
   */
  subAccountId?: string;

  /**
   * Backend-supported optional field.
   *
   * The Payment Pages API documents this as a string.
   */
  subAccountGroupId?: string;

  /**
   * Backend-supported optional JSON-encoded extra fields.
   */
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
  updatePaymentLink: (
    data: Partial<PaymentLinkDraft>
  ) => void;

  /**
   * Reset the draft after successful creation.
   */
  resetPaymentLink: () => void;
}

const initialState: PaymentLinkDraft = {
  /**
   * ---------------------------------------------------------------------------
   * Step 1 - Information
   * ---------------------------------------------------------------------------
   */

  linkName: "",

  amount: "",

  currency: "NGN",

  description: "",

  /**
   * ---------------------------------------------------------------------------
   * Step 2 - Settings
   * ---------------------------------------------------------------------------
   */

  /**
   * Future backend field.
   */
  expiryDate: null,

  /**
   * Backend-supported Payment Page type.
   */
  pageType: "single",

  /**
   * Future backend field.
   */
  paymentType: "one-time",

  /**
   * Backend-supported fixed amount setting.
   */
  isFixedAmount: true,

  /**
   * Future backend field.
   */
  allowMultiplePayments: false,

  /**
   * Future backend field.
   */
  collectCustomerName: false,

  /**
   * Future backend field.
   */
  collectCustomerEmail: false,

  /**
   * Backend-supported phone collection setting.
   */
  isPhoneNumberRequired: false,

  /**
   * Backend-supported test mode setting.
   */
  isTestMode: false,

  /**
   * Backend-supported redirect URL.
   */
  redirectUrl: "",

  /**
   * Backend-supported optional sub-account.
   */
  subAccountId: undefined,

  /**
   * Backend-supported optional sub-account group.
   */
  subAccountGroupId: undefined,

  /**
   * Backend-supported optional extra fields.
   */
  extraFields: "",
};

export const usePaymentLink =
  create<PaymentLinkState>((set) => ({
    /**
     * Current payment link draft.
     */
    paymentLink: initialState,

    /**
     * Merge new values into the existing draft.
     */
    updatePaymentLink: (data) =>
      set((state) => ({
        paymentLink: {
          ...state.paymentLink,
          ...data,
        },
      })),

    /**
     * Reset the draft after successful creation.
     */
    resetPaymentLink: () =>
      set({
        paymentLink: initialState,
      }),
  }));