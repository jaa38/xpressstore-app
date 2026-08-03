import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

import { spacing } from "@/theme";

import { Order } from "@/types/order";

import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  order: Order;
}

export function OrderSummarySection({
  order,
}: Props) {
  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        {/* <OrderStatusBadge
          status={order.status}
          size="lg"
        /> */}

        <AppText
          variant="displayLarge"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {formatCurrency(order.total, {
            currency: order.currency,
          })}
        </AppText>

        <AppText
          variant="bodyLargeBold"
          style={{
            marginTop: spacing.sm,
          }}
        >
          {order.customerName}
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {order.reference}
        </AppText>
      </View>
    </Card>
  );
}