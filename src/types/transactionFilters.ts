export type TransactionStatus =
  | "all"
  | "paid"
  | "pending"
  | "failed";

export type PaymentChannel =
  | "all"
  | "card"
  | "bank"
  | "transfer"
  | "qr"
  | "ussd";

export type TransactionType =
  | "all"
  | "credit"
  | "debit";

export interface TransactionFilters {
  status: TransactionStatus;
  channel: PaymentChannel;
  type: TransactionType;
}