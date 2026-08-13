import { z } from "zod";

export const paymentLinkSettingsSchema = z.object({
  /**
   * ---------------------------------------------------------------------------
   * Expiry
   * ---------------------------------------------------------------------------
   *
   * Future backend field.
   *
   * Retained in the UI/draft but not currently sent to the Payment Pages API.
   */
  expiryDate: z.date().nullable(),

  /**
   * ---------------------------------------------------------------------------
   * Payment Page Type
   * ---------------------------------------------------------------------------
   *
   * Current backend-supported values:
   *
   * - single
   * - donation
   */
  pageType: z.enum(["single", "donation"]),

  /**
   * ---------------------------------------------------------------------------
   * Payment Type
   * ---------------------------------------------------------------------------
   *
   * Future backend field.
   *
   * Retained in the UI/draft but not currently sent to the Payment Pages API.
   */
  paymentType: z.enum([
    "one-time",
    "subscription",
  ]),

  /**
   * ---------------------------------------------------------------------------
   * Payment Behaviour
   * ---------------------------------------------------------------------------
   *
   * `isFixedAmount` is currently supported by the backend.
   */
  isFixedAmount: z.boolean(),

  /**
   * Future backend field.
   *
   * Retained in the UI/draft but not currently sent to the Payment Pages API.
   */
  allowMultiplePayments: z.boolean(),

  /**
   * ---------------------------------------------------------------------------
   * Customer Information
   * ---------------------------------------------------------------------------
   *
   * Future backend fields are retained in the UI/draft.
   */
  collectCustomerName: z.boolean(),

  collectCustomerEmail: z.boolean(),

  /**
   * Currently supported by the Payment Pages API.
   */
  isPhoneNumberRequired: z.boolean(),

  /**
   * ---------------------------------------------------------------------------
   * Environment
   * ---------------------------------------------------------------------------
   */
  isTestMode: z.boolean(),

  /**
   * ---------------------------------------------------------------------------
   * Redirect URL
   * ---------------------------------------------------------------------------
   */
  redirectUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  /**
   * ---------------------------------------------------------------------------
   * Optional Advanced Fields
   * ---------------------------------------------------------------------------
   *
   * The backend-aligned PaymentLinkDraft represents these as strings.
   */
  subAccountId: z.string().optional(),

  subAccountGroupId: z.string().optional(),

  extraFields: z.string().optional(),
});

export type PaymentLinkSettingsForm = z.infer<
  typeof paymentLinkSettingsSchema
>;