import type { PaymentChannel } from "./payment";

export type OrderStatus = "delivered" | "returned" | "failed" | "paid";

export interface Order {
  id: string;

  reference: string;

  customerName: string;

  image: string;

  total: number;

  currency: "NGN" | "USD" | "GBP" | "EUR";

  itemCount: number;

  productName: string;

  paymentChannel: PaymentChannel;

  status: OrderStatus;

  createdAt: string;
}
