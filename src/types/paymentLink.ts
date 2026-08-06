import type { Currency } from "@/types/currency";

export type PaymentLinkStatus =
  | "all"
  | "paid"
  | "pending"
  | "failed"
  | "inactive";

export type PaymentLinkType =
  | "single"
  | "multiple";

export interface PaymentLink {
  id: number;

  name: string;

  description: string;

  amount: number;

  currency: Currency;

  pageType: PaymentLinkType;

  paymentLinkReference: string;

  paymentLink: string;

  isActive: boolean;

  isFixedAmount: boolean;

  redirectUrl?: string;

  isPhoneNumberRequired: boolean;

  isTestMode: boolean;

  subAccountId?: number;

  subAccountGroupId?: number;

  extraFields?: string;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * ---------------------------------------------------------------------------
 * Create Payment Link
 * ---------------------------------------------------------------------------
 */

export interface CreatePaymentLinkRequest {
  name: string;

  description?: string;

  amount: number;

  currency: Currency;

  pageType: PaymentLinkType;

  paymentLinkReference: string;

  isFixedAmount: boolean;

  redirectUrl?: string;

  isPhoneNumberRequired: boolean;

  isTestMode: boolean;

  subAccountId?: number;

  subAccountGroupId?: number;

  extraFields?: string;
}

/**
 * ---------------------------------------------------------------------------
 * Update Payment Link
 * ---------------------------------------------------------------------------
 */

export interface UpdatePaymentLinkRequest
  extends CreatePaymentLinkRequest {
  id: number;
}

/**
 * ---------------------------------------------------------------------------
 * Payment Link Transactions
 * ---------------------------------------------------------------------------
 */

export interface PaymentLinkTransaction {
  transactionId: string;

  customerName: string;

  amount: number;

  paymentDate: string;

  status: string;
}