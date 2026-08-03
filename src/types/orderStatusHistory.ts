import { OrderStatus } from "./order";

export interface OrderStatusHistory {
  id: string;

  status: OrderStatus;

  createdAt: string;

  updatedBy: string;

  note?: string;
}