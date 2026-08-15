import type { PaymentLinkTransaction } from "@/types/paymentLink";

export type PaymentLinkTransactionStatus =
  | "paid"
  | "pending"
  | "failed";

export function mapPaymentLinkTransactionStatus(
  transaction: PaymentLinkTransaction
): PaymentLinkTransactionStatus {
  const status = transaction.status
    .trim()
    .toLowerCase();

  switch (status) {
    case "successful":
    case "success":
    case "paid":
    case "completed":
      return "paid";

    case "pending":
    case "processing":
      return "pending";

    case "failed":
    case "failure":
    case "declined":
      return "failed";

    default:
      /**
       * The Payment Pages API currently documents `status` as a string.
       *
       * Unknown values must not be silently treated as successful.
       * Pending is the safest UI representation until the backend
       * documents additional status values.
       */
      return "pending";
  }
}