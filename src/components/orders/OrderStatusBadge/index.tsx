import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing } from "@/theme";

import { ORDER_STATUS } from "@/constants/orderStatus";

import { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

export function OrderStatusBadge({
  status,
  size = "md",
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS[status];

  const sizes = {
    sm: {
      icon: 14,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      text: "bodySmallBold" as const,
    },

    md: {
      icon: 18,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      text: "bodySmallBold" as const,
    },

    lg: {
      icon: 22,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      text: "bodyBold" as const,
    },
  };

  const current = sizes[size];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",

        borderRadius: radius.full,

        paddingHorizontal:
          current.paddingHorizontal,

        paddingVertical:
          current.paddingVertical,

        backgroundColor:
          config.background,
      }}
    >
      <Ionicons
        name={config.icon}
        size={current.icon}
        color={config.iconColor}
      />

      <AppText
        variant={current.text}
        style={{
          marginLeft: spacing.xs,
          color: config.textColor,
        }}
      >
        {config.label}
      </AppText>
    </View>
  );
}