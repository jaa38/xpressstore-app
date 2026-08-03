import { Ionicons } from "@expo/vector-icons";

import { OrderStatus } from "@/types/order";

import type { TimelineState } from "@/components/orders/OrderTimelineItem";

export interface TimelineItem {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];
  state: TimelineState;
}

export const ORDER_TIMELINE: Record<
  OrderStatus,
  TimelineItem[]
> = {
  paid: [
    {
      title: "Order Created",
      subtitle:
        "Customer placed this order.",
      icon: "receipt-outline",
      state: "completed",
    },
    {
      title: "Payment Received",
      subtitle:
        "Payment completed successfully.",
      icon: "card-outline",
      state: "completed",
    },
    {
      title: "Ready for Delivery",
      subtitle:
        "Awaiting fulfilment.",
      icon: "time-outline",
      state: "current",
    },
  ],

  delivered: [
    {
      title: "Order Created",
      subtitle:
        "Customer placed this order.",
      icon: "receipt-outline",
      state: "completed",
    },
    {
      title: "Payment Received",
      subtitle:
        "Payment completed successfully.",
      icon: "card-outline",
      state: "completed",
    },
    {
      title: "Delivered",
      subtitle:
        "Order has been delivered.",
      icon: "cube-outline",
      state: "completed",
    },
  ],

  returned: [
    {
      title: "Order Created",
      subtitle:
        "Customer placed this order.",
      icon: "receipt-outline",
      state: "completed",
    },
    {
      title: "Payment Received",
      subtitle:
        "Payment completed successfully.",
      icon: "card-outline",
      state: "completed",
    },
    {
      title: "Returned",
      subtitle:
        "Customer returned the order.",
      icon:
        "return-up-back-outline",
      state: "error",
    },
  ],

  failed: [
    {
      title: "Order Created",
      subtitle:
        "Customer attempted checkout.",
      icon: "receipt-outline",
      state: "completed",
    },
    {
      title: "Payment Failed",
      subtitle:
        "Payment could not be processed.",
      icon:
        "close-circle-outline",
      state: "error",
    },
    {
      title: "Order Cancelled",
      subtitle:
        "Order was not created.",
      icon: "ban-outline",
      state: "pending",
    },
  ],
};