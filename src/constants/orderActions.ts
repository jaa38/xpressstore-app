import { OrderStatus } from "@/types/order";

export interface OrderAction {
  status: OrderStatus;
  label: string;
  description: string;
  destructive?: boolean;
}

/**
 * Order actions currently supported by the XpressStore API.
 *
 * The documented Store API exposes ToggleDelivery, which allows
 * a paid order to be marked as delivered.
 *
 * Returned orders and payment retries are not currently backed
 * by documented endpoints, so they are intentionally excluded.
 */
export const ORDER_ACTIONS: Record<OrderStatus, OrderAction[]> = {
  paid: [
    {
      status: "delivered",
      label: "Mark as Delivered",
      description: "Confirm the customer has received the order.",
    },
  ],

  delivered: [],

  returned: [],

  failed: [],
};
