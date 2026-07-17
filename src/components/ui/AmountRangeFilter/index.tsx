import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface AmountRangeFilterProps {
  min: number;
  max: number;
  minimumValue?: number;
  maximumValue?: number;
  onValueChange: (min: number, max: number) => void;
}

export function AmountRangeFilter({
  min,
  max,
  minimumValue = 0,
  maximumValue = 500000,
  onValueChange,
}: AmountRangeFilterProps) {
  return (
    <View>
      <AppText
        variant="bodyLargeBold"
        style={{
          marginBottom: spacing.sm,
        }}
      >
        ₦{min.toLocaleString()} - ₦{max.toLocaleString()}
      </AppText>

      <MultiSlider
        values={[min, max]}
        min={minimumValue}
        max={maximumValue}
        step={1000}
        sliderLength={300}
        selectedStyle={{
          backgroundColor: theme.button.primary.background,
        }}
        unselectedStyle={{
          backgroundColor: theme.border.default,
        }}
        markerStyle={{
          backgroundColor: theme.button.primary.background,
        }}
        onValuesChange={(values: (number | undefined)[]) => {
          const [minValue, maxValue] = values;

          if (minValue === undefined || maxValue === undefined) {
            return;
          }

          onValueChange(minValue, maxValue);
        }}
      />
    </View>
  );
}