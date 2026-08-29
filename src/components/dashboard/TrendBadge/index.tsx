import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

type TrendBadgeProps = {
  value: number;
};

export function TrendBadge({ value }: TrendBadgeProps) {
  /**
   * --------------------------------------------------------------------------
   * TREND STATE
   * --------------------------------------------------------------------------
   */

  const isIncrease = value > 0;
  const isDecrease = value < 0;

  /**
   * --------------------------------------------------------------------------
   * ICON
   * --------------------------------------------------------------------------
   */

  const iconName = isIncrease
    ? "trending-up"
    : isDecrease
      ? "trending-down"
      : "remove";

  /**
   * --------------------------------------------------------------------------
   * TREND COLOR
   * --------------------------------------------------------------------------
   */

  const trendColor = isIncrease
    ? theme.text.success
    : isDecrease
      ? theme.text.error
      : theme.text.secondary;

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

        // Keep the badge background white.
        backgroundColor: theme.card.stats.background,
      }}
    >
      <Ionicons name={iconName} size={16} color={trendColor} />

      <AppText
        style={{
          color: trendColor,
        }}
      >
        {formattedValue}
      </AppText>
    </View>
  );
}
