import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

type DashboardMetricProps = {
  label: string;
  value: string;
};

export function DashboardMetric({
  label,
  value,
}: DashboardMetricProps) {
  return (
    <View
      style={{
        gap: spacing.xs,
      }}
    >
      <AppText
        variant="caption"
        color="inverse"
        style={{
          opacity: 0.8,
        }}
      >
        {label}
      </AppText>

      <AppText
        variant="bodyLargeBold"
        color="inverse"
      >
        {value}
      </AppText>
    </View>
  );
}