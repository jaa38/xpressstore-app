import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Transaction } from "@/types/transaction";

import { formatDateTime } from "@/utils/formatters/date";

interface Props {
  transaction: Transaction;
}

type TimelineItem = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
};

export function TransactionTimelineSection({ transaction }: Props) {
  const timeline: TimelineItem[] = [
    {
      title: "Transaction Created",
      subtitle: formatDateTime(new Date(transaction.createdAt)),
      icon: "receipt-outline",
      color: theme.icon.info.icon,
    },
    {
      title:
        transaction.status === "paid"
          ? "Payment Successful"
          : transaction.status === "pending"
            ? "Awaiting Payment"
            : "Payment Failed",

      subtitle:
        transaction.status === "paid"
          ? "Funds received successfully."
          : transaction.status === "pending"
            ? "Waiting for customer confirmation."
            : "The payment could not be completed.",

      icon:
        transaction.status === "paid"
          ? "checkmark-circle"
          : transaction.status === "pending"
            ? "time"
            : "close-circle",

      color:
        transaction.status === "paid"
          ? theme.icon.success.icon
          : transaction.status === "pending"
            ? theme.icon.warning.icon
            : theme.icon.error.icon,
    },
  ];

  return (
    <Card
      style={{
        marginTop: spacing.lg,
        paddingHorizontal: 0,
        paddingVertical: 0,
      }}
    >
      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">Timeline</AppText>
      </View>

      <Divider />

      {timeline.map((item, index) => (
        <View
          key={item.title}
          style={{
            flexDirection: "row",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          {/* Timeline */}

          <View
            style={{
              alignItems: "center",
              width: 36,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.background.surface,
              }}
            >
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>

            {index !== timeline.length - 1 && (
              <View
                style={{
                  flex: 1,
                  width: 2,
                  marginTop: spacing.xs,
                  backgroundColor: theme.divider.default,
                }}
              />
            )}
          </View>

          {/* Content */}

          <View
            style={{
              flex: 1,
              marginLeft: spacing.md,
              paddingBottom: spacing.md,
            }}
          >
            <AppText variant="bodyBold">{item.title}</AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              {item.subtitle}
            </AppText>
          </View>
        </View>
      ))}
    </Card>
  );
}
