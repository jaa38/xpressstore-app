import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

type TrendBadgeProps = {
  value: string;
};

export function TrendBadge({
  value,
}: TrendBadgeProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,

        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.rg,

        borderRadius: radius.xl,

        backgroundColor: theme.card.stats.background,
      }}
    >
      <Ionicons
        name="trending-up"
        size={16}
        color={theme.card.dashboard.text}
      />

      <AppText
        style={{
          color: theme.card.dashboard.text,
        }}
      >
        {value}
      </AppText>
    </View>
  );
}