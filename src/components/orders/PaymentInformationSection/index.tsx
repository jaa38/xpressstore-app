import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

import { formatOrderDate } from "@/utils/formatOrderDate";

interface Props {
  order: Order;
}

export function PaymentInformationSection({
  order,
}: Props) {
  const paymentChannelLabels: Record<
    Order["paymentChannel"],
    string
  > = {
    bank: "Bank",
    card: "Card",
    nqr: "NQR",
    bankTransfer: "Bank Transfer",
    ussd: "USSD",
  };

  const paymentChannelIcons: Record<
    Order["paymentChannel"],
    React.ComponentProps<typeof Ionicons>["name"]
  > = {
    bank: "business-outline",
    card: "card-outline",
    nqr: "qr-code-outline",
    bankTransfer: "swap-horizontal-outline",
    ussd: "keypad-outline",
  };

  const statusLabels = {
    paid: "Paid",
    delivered: "Delivered",
    returned: "Returned",
    failed: "Failed",
  };

  const statusColors = {
    paid: theme.text.success,
    delivered: theme.text.success,
    returned: theme.text.warning,
    failed: theme.text.error,
  };

  const rows: {
    label: string;
    value: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    valueColor?: string;
  }[] = [
    {
      label: "Reference",
      value: order.reference,
      icon: "document-text-outline",
    },
    {
      label: "Payment Channel",
      value: paymentChannelLabels[order.paymentChannel],
      icon: paymentChannelIcons[order.paymentChannel],
    },
    {
      label: "Status",
      value: statusLabels[order.status],
      icon:
        order.status === "paid"
          ? "checkmark-circle-outline"
          : order.status === "delivered"
            ? "cube-outline"
            : order.status === "returned"
              ? "return-up-back-outline"
              : "close-circle-outline",
      valueColor: statusColors[order.status],
    },
    {
      label: "Currency",
      value: order.currency,
      icon: "cash-outline",
    },
    {
      label: "Date",
      value: formatOrderDate(order.createdAt),
      icon: "calendar-outline",
    },
  ];

  return (
    <Card
      style={{
        marginTop: spacing.lg,
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
          Payment Information
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
                  color: row.valueColor,
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