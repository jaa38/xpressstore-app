import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { TrendBadge } from "@/components/dashboard/TrendBadge";

import { radius, spacing, theme } from "@/theme";

type DashboardStatsCardProps = {
  title: string;
  amount: string;
  trend: number;
};

export function DashboardStatsCard({
  title,
  amount,
  trend,
}: DashboardStatsCardProps) {
  return (
    <Card
      style={{
        marginTop: spacing.lg,

        paddingVertical: spacing.lg,

        borderRadius: radius.lg,

        borderColor: "transparent",

        backgroundColor: theme.card.dashboard.background,
      }}
    >
      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            gap: spacing.sm,
          }}
        >
          <AppText
            variant="bodyLargeBold"
            style={{
              color: theme.card.dashboard.headerText,
            }}
          >
            {title}
          </AppText>

          <AppText
            variant="displayLarge"
            style={{
              color: theme.card.dashboard.text,
            }}
          >
            {amount}
          </AppText>
        </View>

        <TrendBadge value={trend} />
      </View>
    </Card>
  );
}