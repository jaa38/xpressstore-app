import type { PaymentChannel } from "./payment";

import type { Currency } from "./currency";

export type OrderStatus = "delivered" | "returned" | "failed" | "paid";

export interface Order {
  id: string;

  reference: string;

  customerName: string;

  image: string;

  total: number;

  currency: Currency;

  itemCount: number;

  productName: string;

  paymentChannel: PaymentChannel;

  status: OrderStatus;

  createdAt: string;
}
