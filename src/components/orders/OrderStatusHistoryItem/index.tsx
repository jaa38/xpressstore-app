import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { ORDER_STATUS } from "@/constants/orderStatus";

import { spacing } from "@/theme";

import { OrderStatusHistory } from "@/types/orderStatusHistory";

import { formatOrderDate } from "@/utils/formatOrderDate";

interface Props {
  history: OrderStatusHistory;
}

export function OrderStatusHistoryItem({
  history,
}: Props) {
  const status =
    ORDER_STATUS[history.status];

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: spacing.lg,
      }}
    >
      <Ionicons
        name={status.icon}
        size={22}
        color={status.iconColor}
      />

      <View
        style={{
          flex: 1,
          marginLeft: spacing.md,
        }}
      >
        <AppText variant="bodyBold">
          {status.label}
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
        >
          {formatOrderDate(
            history.createdAt
          )}
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
        >
          Updated by {history.updatedBy}
        </AppText>

        {history.note && (
          <AppText
            variant="bodySmall"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {history.note}
          </AppText>
        )}
      </View>
    </View>
  );
}