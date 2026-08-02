import { Transaction } from "@/types/transaction";

export interface ReceiptVerification {
  verificationUrl: string;
  verificationCode: string;
}

export function getReceiptVerification(
  transaction: Transaction
): ReceiptVerification {
  return {
    verificationUrl:
      `https://merchant.xpresspayments.com/receipt/${transaction.reference}`,

    verificationCode:
      `${transaction.reference}-${transaction.id}`,
  };
}