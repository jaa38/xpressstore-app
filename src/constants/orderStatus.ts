import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/theme";

import { OrderStatus } from "@/types/order";

export const ORDER_STATUS: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ComponentProps<
      typeof Ionicons
    >["name"];

    background: string;

    textColor: string;

    iconColor: string;
  }
> = {
  paid: {
    label: "Paid",

    icon: "checkmark-circle",

    background:
      theme.state.success.background,

    textColor:
      theme.text.success,

    iconColor:
      theme.icon.success.icon,
  },

  delivered: {
    label: "Delivered",

    icon: "cube",

    background:
      theme.state.success.background,

    textColor:
      theme.text.success,

    iconColor:
      theme.icon.success.icon,
  },

  returned: {
    label: "Returned",

    icon: "return-up-back",

    background:
      theme.state.warning.background,

    textColor:
      theme.text.warning,

    iconColor:
      theme.icon.warning.icon,
  },

  failed: {
    label: "Failed",

    icon: "close-circle",

    background:
      theme.state.error.background,

    textColor:
      theme.text.error,

    iconColor:
      theme.icon.error.icon,
  },
};