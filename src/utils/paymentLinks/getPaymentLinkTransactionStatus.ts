import type { PaymentLink, PaymentLinkTransaction } from "@/types/paymentLink";

import {
  mapPaymentLinkTransactionStatus,
  type PaymentLinkTransactionStatus,
} from "@/utils/paymentLinks/mapPaymentLinkTransactionStatus";

/**
 * ---------------------------------------------------------------------------
 * Payment Link Transaction Status
 * ---------------------------------------------------------------------------
 *
 * Derives the payment status of a payment link from its transactions.
 *
 * Rules:
 *
 * - Inactive payment links remain inactive regardless of transactions.
 * - A successful transaction takes priority over pending/failed transactions.
 * - Pending takes priority over failed.
 * - Failed is returned when all transactions have failed.
 * - An active payment link with no transactions remains active.
 */
export type DerivedPaymentLinkStatus =
  | "active"
  | "inactive"
  | "paid"
  | "pending"
  | "failed";

export function getPaymentLinkTransactionStatus(
  paymentLink: PaymentLink,
  transactions: PaymentLinkTransaction[]
): DerivedPaymentLinkStatus {
  if (!paymentLink.isActive) {
    return "inactive";
  }

  if (transactions.length === 0) {
    return "active";
  }

  const statuses = transactions.map(mapPaymentLinkTransactionStatus);

  const hasPaidTransaction = statuses.includes("paid");

  if (hasPaidTransaction) {
    return "paid";
  }

  const hasPendingTransaction = statuses.includes("pending");

  if (hasPendingTransaction) {
    return "pending";
  }

  return "failed";
}
