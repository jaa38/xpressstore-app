import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { OrderTimelineItem } from "@/components/orders/OrderTimelineItem";

import { spacing } from "@/theme";

import { Order } from "@/types/order";

import type { TimelineState } from "@/components/orders/OrderTimelineItem";

interface Props {
  order: Order;
}

interface TimelineItem {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  state: TimelineState;
}

export function OrderTimelineSection({ order }: Props) {
  const timeline: TimelineItem[] = (() => {
    switch (order.status) {
      case "paid":
        return [
          {
            title: "Order Created",
            subtitle: "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
          },
          {
            title: "Payment Received",
            subtitle: "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
          },
          {
            title: "Ready for Delivery",
            subtitle: "Awaiting fulfilment.",
            icon: "time-outline",
            state: "current",
          },
        ];

      case "delivered":
        return [
          {
            title: "Order Created",
            subtitle: "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
          },
          {
            title: "Payment Received",
            subtitle: "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
          },
          {
            title: "Delivered",
            subtitle: "Order has been delivered.",
            icon: "cube-outline",
            state: "completed",
          },
        ];

      case "returned":
        return [
          {
            title: "Order Created",
            subtitle: "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
          },
          {
            title: "Payment Received",
            subtitle: "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
          },
          {
            title: "Returned",
            subtitle: "Customer returned the order.",
            icon: "return-up-back-outline",
            state: "error",
          },
        ];

      case "failed":
        return [
          {
            title: "Order Created",
            subtitle: "Customer attempted checkout.",
            icon: "receipt-outline",
            state: "completed",
          },
          {
            title: "Payment Failed",
            subtitle: "Payment could not be processed.",
            icon: "close-circle-outline",
            state: "error",
          },
          {
            title: "Order Cancelled",
            subtitle: "Order was not created.",
            icon: "ban-outline",
            state: "pending",
          },
        ];
    }
  })();

  return (
    <Card
      style={{
        marginTop: spacing.lg,
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">Order Timeline</AppText>
      </View>

      <Divider />

      {timeline.map((item, index) => (
        <View key={item.title}>
          <OrderTimelineItem
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            state={item.state}
            isLast={index === timeline.length - 1}
          />

          {index < timeline.length - 1 && <Divider />}
        </View>
      ))}
    </Card>
  );
}
