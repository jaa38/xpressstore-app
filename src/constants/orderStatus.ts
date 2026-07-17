import type { Ionicons } from "@expo/vector-icons";

import type { OrderStatus } from "@/types/order";

import type { Color } from "@/components/ui/AppText";

import { theme } from "@/theme";

type OrderStatusConfig = {
  icon: React.ComponentProps<typeof Ionicons>["name"];

  iconColor: string;

  amountColor: Color;
};

export const ORDER_STATUS: Record<
  Exclude<OrderStatus, "paid">,
  OrderStatusConfig
> = {
  delivered: {
    icon: "checkmark-circle",
    iconColor: theme.icon.success.icon,
    amountColor: "success",
  },

  returned: {
    icon: "return-down-back",
    iconColor: theme.orderStatus.returned.text,
    amountColor: "returned",
  },

  failed: {
    icon: "close-circle-outline",
    iconColor: theme.orderStatus.failed.text,
    amountColor: "error",
  },
};