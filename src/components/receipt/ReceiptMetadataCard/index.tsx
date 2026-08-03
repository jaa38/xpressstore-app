import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

import { formatOrderDate } from "@/utils/formatOrderDate";

import { PAYMENT_CHANNELS } from "@/constants/paymentChannels";

interface Props {
  order: Order;
}

export function ReceiptMetadataCard({
  order,
}: Props) {
  const rows: {
    label: string;
    value: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    {
      label: "Receipt Number",
      value: order.reference,
      icon: "receipt-outline",
    },
    {
      label: "Generated",
      value: formatOrderDate(order.createdAt),
      icon: "calendar-outline",
    },
    {
      label: "Payment Channel",
      value:
        PAYMENT_CHANNELS[order.paymentChannel]
          ?.label ?? "Unknown",
      icon:
        PAYMENT_CHANNELS[order.paymentChannel]
          ?.icon ?? "card-outline",
    },
    {
      label: "Currency",
      value: order.currency,
      icon: "cash-outline",
    },
    {
      label: "Status",
      value:
        order.status.charAt(0).toUpperCase() +
        order.status.slice(1),
      icon:
        order.status === "paid"
          ? "checkmark-circle-outline"
          : order.status === "delivered"
            ? "cube-outline"
            : order.status === "returned"
              ? "return-up-back-outline"
              : "close-circle-outline",
    },
  ];

  return (
    <Card
      style={{
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,

        paddingHorizontal: 0,
        paddingVertical: 0,

        overflow: "hidden",
      }}
    >
      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">
          Receipt Details
        </AppText>
      </View>

      <Divider />

      {rows.map((row, index) => (
        <View key={row.label}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,

                borderRadius: 999,

                justifyContent: "center",
                alignItems: "center",

                backgroundColor:
                  theme.icon.default.background,
              }}
            >
              <Ionicons
                name={row.icon}
                size={20}
                color={theme.icon.default.icon}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.md,
              }}
            >
              <AppText
                variant="bodySmall"
                color="secondary"
              >
                {row.label}
              </AppText>

              <AppText
                variant="bodyBold"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                {row.value}
              </AppText>
            </View>
          </View>

          {index < rows.length - 1 && (
            <Divider />
          )}
        </View>
      ))}
    </Card>
  );
}