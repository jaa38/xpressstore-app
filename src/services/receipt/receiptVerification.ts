import { Receipt } from "@/types/receipt";

export interface ReceiptVerification {
  verificationUrl: string;
  verificationCode: string;
}

export function getReceiptVerification(
  receipt: Receipt
): ReceiptVerification {
  return {
    verificationUrl: `https://merchant.xpresspayments.com/receipt/${receipt.reference}`,

    verificationCode: `${receipt.reference}-${receipt.id}`,
  };
}