import type { Currency } from "@/types/currency";

export type PaymentLinkStatus =
  | "all"
  | "paid"
  | "pending"
  | "failed"
  | "inactive";

export interface PaymentLink {
  id: string;
  title: string;
  image?: string;
  url: string;
  createdAt: string;

  amount: number;
  currency: Currency;

  status: Exclude<PaymentLinkStatus, "all">;
}