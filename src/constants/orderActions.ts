import { OrderStatus } from "@/types/order";

export interface OrderAction {
  status: OrderStatus;
  label: string;
  description: string;
  destructive?: boolean;
}

export const ORDER_ACTIONS: Record<
  OrderStatus,
  OrderAction[]
> = {
  paid: [
    {
      status: "delivered",
      label: "Mark as Delivered",
      description:
        "Confirm the customer has received the order.",
    },
    {
      status: "returned",
      label: "Mark as Returned",
      description:
        "Record that the order was returned.",
      destructive: true,
    },
  ],

  delivered: [
    {
      status: "returned",
      label: "Mark as Returned",
      description:
        "Record that the delivered order was returned.",
      destructive: true,
    },
  ],

  returned: [],

  failed: [
    {
      status: "paid",
      label: "Retry Payment",
      description:
        "Attempt payment again after resolving the issue.",
    },
  ],
};