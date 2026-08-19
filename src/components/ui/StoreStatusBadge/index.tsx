import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { theme } from "@/theme";

type StoreStatus = "Active" | "Inactive" | "Pending";

interface StoreStatusBadgeProps {
  status: StoreStatus;
}

const statusStyles = {
  Active: {
    background: theme.badge.success.background,
    text: "success" as const,
  },

  Inactive: {
    background: theme.badge.error.background,
    text: "error" as const,
  },

  Pending: {
    background: theme.badge.warning.background,
    text: "warning" as const,
  },
};

export function StoreStatusBadge({
  status,
}: StoreStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: style.background,
      }}
    >
      <AppText
        variant="bodySmall"
        color={style.text}
      >
        {status}
      </AppText>
    </View>
  );
}