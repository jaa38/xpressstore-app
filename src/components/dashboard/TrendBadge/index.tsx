import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText, type Color } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

type TrendBadgeProps = {
  value: number;
};

export function TrendBadge({
  value,
}: TrendBadgeProps) {
  /**
   * --------------------------------------------------------------------------
   * TREND STATE
   * --------------------------------------------------------------------------
   */

  const trendState =
    value > 0
      ? "positive"
      : value < 0
        ? "negative"
        : "neutral";

  /**
   * --------------------------------------------------------------------------
   * TREND CONFIGURATION
   * --------------------------------------------------------------------------
   */

  const trendConfig: Record<
    "positive" | "negative" | "neutral",
    {
      icon: "trending-up" | "trending-down" | "remove";
      color: Color;
    }
  > = {
    positive: {
      icon: "trending-up",
      color: "success",
    },

    negative: {
      icon: "trending-down",
      color: "error",
    },

    neutral: {
      icon: "remove",
      color: "secondary",
    },
  };

  const { icon, color } = trendConfig[trendState];

  /**
   * --------------------------------------------------------------------------
   * FORMATTED VALUE
   * --------------------------------------------------------------------------
   */

  const formattedValue = `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,

        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.rg,

        borderRadius: radius.xl,

        /**
         * Keep the badge background white.
         */
        backgroundColor: theme.card.stats.background,
      }}
    >
      <Ionicons
        name={icon}
        size={16}
        color={theme.text[color]}
      />

      <AppText variant='bodyBold' color={color}>
        {formattedValue}
      </AppText>
    </View>
  );
}