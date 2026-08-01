import { FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { PaymentChannel, Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
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
    <Card
      style={{
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
      }}
    >
      <FlatList
        data={transactions}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
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
                  {item.customer}
                </AppText>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons
                    name={paymentChannelIcons[item.channel]}
                    size={16}
                    color={
                      item.type === "credit"
                        ? theme.icon.success.icon
                        : theme.icon.error.icon
                    }
                  />

                  <AppText
                    variant="bodySmallBold"
                    color={item.type === "credit" ? "success" : "error"}
                  >
                    {item.type === "credit" ? "Credit" : "Debit"}
                  </AppText>

                  <Divider
                    orientation="vertical"
                    variant="strong"
                    length={12}
                  />

                  <AppText variant="bodySmall" color="secondary">
                    {formatDateTime(new Date(item.createdAt))}
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
                  {formatCurrency(item.amount, {
                    currency: item.currency,
                  })}
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  {item.reference}
                </AppText>
              </View>
            </View>
          </View>
        )}
      />
    </Card>
  );
}
