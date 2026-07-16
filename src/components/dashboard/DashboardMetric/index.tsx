import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";

type DashboardMetricProps = {
  label: string;
  value: string;
};

export function DashboardMetric({
  label,
  value,
}: DashboardMetricProps) {
  return (
    <View>
      <AppText
        variant="bodySmall"
        color="inverse"
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