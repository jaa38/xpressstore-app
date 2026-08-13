import type { Currency } from "@/types/currency";

/**
 * ---------------------------------------------------------------------------
 * Payment Link Status
 * ---------------------------------------------------------------------------
 *
 * The current Payment Pages API exposes `isActive`, but does not currently
 * expose paid / failed / pending status directly on the payment page.
 *
 * These statuses are retained for the UI because transaction data will
 * eventually be used to derive payment status.
 */
export type PaymentLinkStatus =
  | "all"
  | "paid"
  | "pending"
  | "failed"
  | "inactive";

/**
 * ---------------------------------------------------------------------------
 * Payment Page Type
 * ---------------------------------------------------------------------------
 *
 * Current backend documentation:
 *
 * - single
 * - donation
 */
export type PaymentLinkType =
  | "single"
  | "donation";

/**
 * ---------------------------------------------------------------------------
 * Payment Link / Payment Page
 * ---------------------------------------------------------------------------
 *
 * Represents the Payment Pages response returned by the backend.
 */
export interface PaymentLink {
  id: number;

  name: string;

  description: string;

  amount: number;

  currency: Currency;

  pageType: PaymentLinkType;

  paymentLinkReference: string;

  /**
   * Generated payment page URL.
   *
   * The current backend response documentation does not explicitly guarantee
   * this field, so it remains optional.
   */
  paymentLink?: string;

  isActive: boolean;

  isFixedAmount: boolean;

  redirectUrl?: string;

  isPhoneNumberRequired: boolean;

  isTestMode: boolean;

  /**
   * The backend Payment Pages documentation describes these as strings.
   */
  subAccountId?: string;

  subAccountGroupId?: string;

  /**
   * JSON-encoded extra form fields.
   */
  extraFields?: string;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * ---------------------------------------------------------------------------
 * Create Payment Link Request
 * ---------------------------------------------------------------------------
 *
 * Matches:
 *
 * POST /PaymentPages/Add
 *
 * Only fields supported by the current backend contract belong here.
 */
export interface CreatePaymentLinkRequest {
  name: string;

  description: string;

  amount?: number;

  currency: Currency;

  pageType: PaymentLinkType;

  paymentLinkReference: string;

  isFixedAmount?: boolean;

  redirectUrl?: string;

  isPhoneNumberRequired?: boolean;

  isTestMode?: boolean;

  subAccountId?: string;

  subAccountGroupId?: string;

  extraFields?: string;
}

/**
 * ---------------------------------------------------------------------------
 * Update Payment Link Request
 * ---------------------------------------------------------------------------
 *
 * Matches:
 *
 * POST /PaymentPages/Update
 */
export interface UpdatePaymentLinkRequest
  extends CreatePaymentLinkRequest {
  id: number;
}

/**
 * ---------------------------------------------------------------------------
 * Payment Link Transactions
 * ---------------------------------------------------------------------------
 *
 * Matches:
 *
 * GET /PaymentPages/GetPaymentPageTransactions/{paymentPageId}
 */
export interface PaymentLinkTransaction {
  transactionId: string;

  amount: number;

  status: string;

  dateCreated: string;
}

/**
 * ---------------------------------------------------------------------------
 * Future Payment Link UI Fields
 * ---------------------------------------------------------------------------
 *
 * These fields are intentionally kept separate from the backend DTO.
 *
 * They are currently required by the Payment Link creation UI / wizard,
 * but are not part of the current Payment Pages API contract.
 *
 * Do NOT add these to CreatePaymentLinkRequest or UpdatePaymentLinkRequest
 * until the backend supports them.
 */
export interface FuturePaymentLinkFields {
  expiryDate: Date | null;

  paymentType:
    | "one-time"
    | "subscription";

  allowMultiplePayments: boolean;

  collectCustomerName: boolean;

  collectCustomerEmail: boolean;
}