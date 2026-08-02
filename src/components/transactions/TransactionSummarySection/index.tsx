import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText, type Color } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";

interface Props {
  transaction: Transaction;
}

export function TransactionSummarySection({
  transaction,
}: Props) {
  const statusConfig: Record<
    Transaction["status"],
    {
      title: string;
      color: Color;
      icon: React.ComponentProps<typeof Ionicons>["name"];
      iconColor: string;
      iconBackground: string;
    }
  > = {
    paid: {
      title: "Paid",
      color: "success",
      icon: "checkmark-circle",
      iconColor: theme.icon.success.icon,
      iconBackground: theme.icon.success.background,
    },

    pending: {
      title: "Pending",
      color: "warning",
      icon: "time",
      iconColor: theme.icon.warning.icon,
      iconBackground: theme.icon.warning.background,
    },

    failed: {
      title: "Failed",
      color: "error",
      icon: "close-circle",
      iconColor: theme.icon.error.icon,
      iconBackground: theme.icon.error.background,
    },
  };

  const status = statusConfig[transaction.status];

  return (
    <Card
      variant="active"
      style={{
        marginTop: spacing.lg,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: status.iconBackground,
          }}
        >
          <Ionicons
            name={status.icon}
            size={36}
            color={status.iconColor}
          />
        </View>

        <AppText
          variant="bodySmallBold"
          color="muted"
          style={{
            marginTop: spacing.lg,
          }}
        >
          Transaction Amount
        </AppText>

        <AppText
          variant="displayLarge"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {formatCurrency(transaction.amount, {
            currency: transaction.currency,
          })}
        </AppText>

        <AppText
          variant="bodyLargeBold"
          color={status.color}
          style={{
            marginTop: spacing.sm,
          }}
        >
          {status.title}
        </AppText>
      </View>
    </Card>
  );
}