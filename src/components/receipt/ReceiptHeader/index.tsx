import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

import { Order } from "@/types/order";

interface ReceiptHeaderProps {
  order: Order;
}

export function ReceiptHeader({
  order,
}: ReceiptHeaderProps) {
  const status = {
    paid: {
      label: "Paid",
      background: theme.state.success.background,
      color: theme.text.success,
    },

    delivered: {
      label: "Delivered",
      background: theme.state.success.background,
      color: theme.text.success,
    },

    returned: {
      label: "Returned",
      background: theme.state.warning.background,
      color: theme.text.warning,
    },

    failed: {
      label: "Failed",
      background: theme.state.error.background,
      color: theme.text.error,
    },
  }[order.status];

  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
      }}
    >
      {/* Receipt Icon */}

      <View
        style={{
          width: 72,
          height: 72,
          alignSelf: "center",

          borderRadius: radius.full,

          justifyContent: "center",
          alignItems: "center",

          backgroundColor:
            theme.icon.branding.background,
        }}
      >
        <Ionicons
          name="receipt-outline"
          size={36}
          color={theme.icon.branding.icon}
        />
      </View>

      {/* Amount */}

      <AppText
        variant="displayLarge"
        align="center"
        style={{
          marginTop: spacing.lg,
        }}
      >
        {formatCurrency(order.total, {
          currency: order.currency,
        })}
      </AppText>

      {/* Customer */}

      <AppText
        variant="bodyLargeBold"
        align="center"
        style={{
          marginTop: spacing.sm,
        }}
      >
        {order.customerName}
      </AppText>

      {/* Reference */}

      <AppText
        variant="body"
        color="secondary"
        align="center"
        style={{
          marginTop: spacing.xs,
        }}
      >
        {order.reference}
      </AppText>

      {/* Status */}

      <View
        style={{
          alignSelf: "center",

          marginTop: spacing.lg,

          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,

          borderRadius: radius.full,

          backgroundColor:
            status.background,
        }}
      >
        <AppText
          variant="bodySmallBold"
          style={{
            color: status.color,
          }}
        >
          {status.label}
        </AppText>
      </View>
    </View>
  );
}