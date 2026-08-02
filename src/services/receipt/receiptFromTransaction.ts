import { Receipt } from "@/types/receipt";
import { Transaction } from "@/types/transaction";

const paymentChannelMap = {
  bank: "bank",
  card: "card",
  qr: "nqr",
  transfer: "bankTransfer",
  ussd: "ussd",
} as const;

export function receiptFromTransaction(
  transaction: Transaction
): Receipt {
  return {
    id: transaction.id,

    reference: transaction.reference,

    customer: transaction.customer,

    amount: transaction.amount,

    currency: transaction.currency ?? "NGN",

    channel: paymentChannelMap[transaction.channel],

    status: transaction.status,

    type: transaction.type,

    createdAt: transaction.createdAt,
  };
}