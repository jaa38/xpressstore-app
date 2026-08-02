import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { Transaction } from "@/types/transaction";

import { formatDateTime } from "@/utils/formatters/date";

interface Props {
  transaction: Transaction;
}

type Row = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  valueColor?: string;
};

export function TransactionInformationSection({
  transaction,
}: Props) {
  const paymentChannelLabels: Record<
    Transaction["channel"],
    string
  > = {
    bank: "Bank",
    card: "Card",
    qr: "QR Code",
    transfer: "Transfer",
    ussd: "USSD",
  };

  const paymentChannelIcons: Record<
    Transaction["channel"],
    React.ComponentProps<typeof Ionicons>["name"]
  > = {
    bank: "business-outline",
    card: "card-outline",
    qr: "qr-code-outline",
    transfer: "swap-horizontal-outline",
    ussd: "keypad-outline",
  };

  const statusColours = {
    paid: theme.text.success,
    pending: theme.text.warning,
    failed: theme.text.error,
  };

  const statusLabels = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
  };

  const rows: Row[] = [
    {
      label: "Reference",
      value: transaction.reference,
      icon: "document-text-outline",
    },
    {
      label: "Payment Channel",
      value: paymentChannelLabels[transaction.channel],
      icon: paymentChannelIcons[transaction.channel],
    },
    {
      label: "Transaction Type",
      value:
        transaction.type === "credit"
          ? "Credit"
          : "Debit",
      icon:
        transaction.type === "credit"
          ? "arrow-down-circle-outline"
          : "arrow-up-circle-outline",
    },
    {
      label: "Status",
      value: statusLabels[transaction.status],
      icon:
        transaction.status === "paid"
          ? "checkmark-circle-outline"
          : transaction.status === "pending"
            ? "time-outline"
            : "close-circle-outline",
      valueColor:
        statusColours[transaction.status],
    },
    {
      label: "Date & Time",
      value: formatDateTime(
        new Date(transaction.createdAt)
      ),
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
      {/* Header */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">
          Transaction Information
        </AppText>
      </View>

      <Divider />

      {/* Rows */}

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
            {/* Icon */}

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

            {/* Content */}

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
                  color: row.valueColor,
                  marginTop: spacing.xs,
                }}
              >
                {row.value}
              </AppText>
            </View>
          </View>

          {index < rows.length - 1 && <Divider />}
        </View>
      ))}
    </Card>
  );
}