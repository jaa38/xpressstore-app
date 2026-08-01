import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { PaymentChannel, Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

interface TransactionListItemProps {
  transaction: Transaction;
}

export function TransactionListItem({
  transaction,
}: TransactionListItemProps) {
  const paymentChannelIcons: Record<
    PaymentChannel,
    React.ComponentProps<typeof Ionicons>["name"]
  > = {
    bank: "business-outline",
    card: "card-outline",
    qr: "qr-code-outline",
    transfer: "swap-horizontal-outline",
    ussd: "keypad-outline",
  };

  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="body" color="secondary">
            {transaction.customer}
          </AppText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <Ionicons
              name={paymentChannelIcons[transaction.channel]}
              size={16}
              color={
                transaction.type === "credit"
                  ? theme.icon.success.icon
                  : theme.icon.error.icon
              }
            />

            <AppText
              variant="bodySmallBold"
              color={transaction.type === "credit" ? "success" : "error"}
            >
              {transaction.type === "credit" ? "Credit" : "Debit"}
            </AppText>

            <Divider
              orientation="vertical"
              variant="strong"
              length={12}
            />

            <AppText variant="bodySmall" color="secondary">
              {formatDateTime(new Date(transaction.createdAt))}
            </AppText>
          </View>
        </View>

        {/* Right */}

        <View
          style={{
            alignItems: "flex-end",
            gap: spacing.xs,
            marginLeft: spacing.md,
          }}
        >
          <AppText variant="bodyBold">
            {formatCurrency(transaction.amount, {
              currency: transaction.currency,
            })}
          </AppText>

          <AppText variant="bodySmall" color="secondary">
            {transaction.reference}
          </AppText>
        </View>
      </View>
    </View>
  );
}