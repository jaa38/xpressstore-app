import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { TrendBadge } from "@/components/dashboard/TrendBadge";

import { radius, spacing, theme } from "@/theme";

type Metric = {
  label: string;
  value: string;
};

type DashboardStatsCardProps = {
  title: string;
  amount: string;
  trend: string;
  metrics: Metric[];
};

export function DashboardStatsCard({
  title,
  amount,
  trend,
  metrics,
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

      {/* Footer */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",

          marginTop: spacing.md,
        }}
      >
        {metrics.map((metric, index) => (
          <View
            key={metric.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.lg,
            }}
          >
            <DashboardMetric
              label={metric.label}
              value={metric.value}
            />

            {index < metrics.length - 1 && (
              <Divider
                orientation="vertical"
                length={32}
              />
            )}
          </View>
        ))}
      </View>
    </Card>
  );
}