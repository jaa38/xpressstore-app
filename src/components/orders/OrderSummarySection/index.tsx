import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  order: Order;
}

export function OrderSummarySection({
  order,
}: Props) {
  const statuses: Record<
    Order["status"],
    {
      label: string;
      icon: React.ComponentProps<typeof Ionicons>["name"];
      iconColor: string;
      background: string;
      text: string;
    }
  > = {
    paid: {
      label: "Paid",
      icon: "checkmark-circle",
      iconColor: theme.icon.success.icon,
      background: theme.state.success.background,
      text: theme.text.success,
    },

    delivered: {
      label: "Delivered",
      icon: "cube",
      iconColor: theme.icon.success.icon,
      background: theme.state.success.background,
      text: theme.text.success,
    },

    returned: {
      label: "Returned",
      icon: "return-up-back",
      iconColor: theme.icon.warning.icon,
      background: theme.state.warning.background,
      text: theme.text.warning,
    },

    failed: {
      label: "Failed",
      icon: "close-circle",
      iconColor: theme.icon.error.icon,
      background: theme.state.error.background,
      text: theme.text.error,
    },
  };

  const status = statuses[order.status];

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
        {/* Status Badge */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,

            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,

            borderRadius: 999,

            backgroundColor: status.background,
          }}
        >
          <Ionicons
            name={status.icon}
            size={18}
            color={status.iconColor}
          />

          <AppText
            variant="bodySmallBold"
            style={{
              color: status.text,
            }}
          >
            {status.label}
          </AppText>
        </View>

        {/* Total */}

        <AppText
          variant="displayLarge"
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