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
  description: string;

  url: string;

  amount: number;
  currency: Currency;

  status: Exclude<PaymentLinkStatus, "all">;

  expiry_date: string | null;

  payment_type: "one-time" | "subscription";

  allow_multiple_payments: boolean;

  collect_customer_name: boolean;

  collect_customer_email: boolean;

  redirect_url: string;

  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkPayload {
  title: string;
  description: string;

  url: string;

  amount: number;
  currency: Currency;

  status: Exclude<PaymentLinkStatus, "all">;

  expiry_date: string | null;

  payment_type: "one-time" | "subscription";

  allow_multiple_payments: boolean;

  collect_customer_name: boolean;

  collect_customer_email: boolean;

  redirect_url: string;
}