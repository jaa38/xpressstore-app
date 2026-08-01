import type { Currency } from "@/types/currency";

export type PaymentChannel =
  | "bank"
  | "card"
  | "qr"
  | "transfer"
  | "ussd";

export type TransactionType = "credit" | "debit";

export type TransactionStatus =
  | "paid"
  | "pending"
  | "failed";

export interface Transaction {
  id: string;

  customer: string;

  type: TransactionType;

  status: TransactionStatus;

  channel: PaymentChannel;

  amount: number;

  currency?: Currency;

  reference: string;

  createdAt: string;
}