import type { Currency } from "./currency";
import type { PaymentChannel } from "./payment";

export type ReceiptStatus =
  | "paid"
  | "pending"
  | "failed";

export interface Receipt {
  id: string;

  reference: string;

  customer: string;

  amount: number;

  currency: Currency;

  channel: PaymentChannel;

  status: ReceiptStatus;

  type: "credit" | "debit";

  createdAt: string;
}