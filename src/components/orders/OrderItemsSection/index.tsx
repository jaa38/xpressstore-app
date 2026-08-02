import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { Order } from "@/types/order";

import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  order: Order;
}

export function OrderItemsSection({ order }: Props) {
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
        <AppText variant="h3">Order Items</AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {order.items.length} item
          {order.items.length === 1 ? "" : "s"}
        </AppText>
      </View>

      <Divider />

      {order.items.map((item, index) => (
        <View key={item.productId}>
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* Left */}

              <View
                style={{
                  flex: 1,
                  paddingRight: spacing.md,
                }}
              >
                <AppText variant="bodyBold">{item.productName}</AppText>

                <AppText
                  variant="bodySmall"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  Quantity: {item.quantity}
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  Unit Price:{" "}
                  {formatCurrency(item.unitPrice, {
                    currency: item.currency,
                  })}
                </AppText>
              </View>

              {/* Right */}

              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <AppText variant="bodyLargeBold">
                  {formatCurrency(item.subtotal, {
                    currency: item.currency,
                  })}
                </AppText>
              </View>
            </View>
          </View>

          {index < order.items.length - 1 && <Divider />}
        </View>
      ))}
    </Card>
  );
}
