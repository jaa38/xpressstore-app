import type { PaymentChannel } from "./payment";
import type { Currency } from "./currency";
import type { OrderItem } from "./orderItem";

export type OrderStatus =
  | "delivered"
  | "returned"
  | "failed"
  | "paid";

export interface Order {
  id: string;

  reference: string;

  customerName: string;

  total: number;

  currency: Currency;

  items: OrderItem[];

  paymentChannel: PaymentChannel;

  status: OrderStatus;

  createdAt: string;
}
