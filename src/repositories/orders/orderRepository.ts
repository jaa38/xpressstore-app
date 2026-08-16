import type { Order } from "@/types/order";

export interface OrderRepository {
  getOrders(): Promise<Order[]>;

  getOrderById(
    id: string
  ): Promise<Order | null>;

  saveOrders(
    orders: Order[]
  ): Promise<void>;

  saveOrder(
    order: Order
  ): Promise<void>;

  deleteOrder(
    id: string
  ): Promise<void>;

  clearOrders(): Promise<void>;
}