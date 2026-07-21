import type { PaymentChannel } from "./payment";

import type { Currency } from "./currency";

import type { OrderItem } from "./orderItem";

export type OrderStatus = "delivered" | "returned" | "failed" | "paid";

export interface Order {
  id: string;

  reference: string;

  customerName: string;

  image: string;

  total: number;

  currency: Currency;

  itemCount: number;

  items: OrderItem[];

  productName: string;

  paymentChannel: PaymentChannel;

  status: OrderStatus;

  createdAt: string;
}
