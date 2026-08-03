import type { PaymentChannel } from "./payment";
import type { Currency } from "./currency";
import type { OrderItem } from "./orderItem";

import type { OrderStatusHistory } from "./orderStatusHistory";

export type OrderStatus =
  | "delivered"
  | "returned"
  | "failed"
  | "paid";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface Order {
  id: string;

  reference: string;

  customerName: string;

  customerPhone: string;

  customerEmail?: string;

  deliveryAddress?: DeliveryAddress;

  total: number;

  currency: Currency;

  items: OrderItem[];

  paymentChannel: PaymentChannel;

  status: OrderStatus;

  createdAt: string;

  updatedAt?: string;

  statusHistory: OrderStatusHistory[];
}