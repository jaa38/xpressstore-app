import { useState } from "react";

import { View } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

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
  const [sliderWidth, setSliderWidth] = useState(0);

  return (
    <View>
      {/* Selected */}

      <AppText
        variant="caption"
        color="secondary"
        style={{
          marginBottom: spacing.xs,
        }}
      >
        Selected
      </AppText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.md,
        }}
      >
        <AppText variant="bodyLargeBold">
          {formatCurrency(min)}
        </AppText>

        <AppText variant="bodyLargeBold">
          {formatCurrency(max)}
        </AppText>
      </View>

      {/* Slider */}

      <View
        onLayout={(event) => {
          setSliderWidth(event.nativeEvent.layout.width);
        }}
      >
        {sliderWidth > 0 && (
          <MultiSlider
            values={[min, max]}
            min={minimumValue}
            max={maximumValue}
            step={1000}
            sliderLength={sliderWidth}
            selectedStyle={{
              backgroundColor:
                theme.button.primary.background,
            }}
            unselectedStyle={{
              backgroundColor:
                theme.border.default,
              height: 4,
            }}
            trackStyle={{
              height: 4,
              borderRadius: 2,
            }}
            markerStyle={{
              backgroundColor:
                theme.button.primary.background,
              height: 22,
              width: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: theme.background.primary,
            }}
            pressedMarkerStyle={{
              height: 26,
              width: 26,
              borderRadius: 13,
            }}
            onValuesChange={(values) => {
              const [minValue, maxValue] = values;

              if (
                minValue === undefined ||
                maxValue === undefined
              ) {
                return;
              }

              onValueChange(minValue, maxValue);
            }}
          />
        )}
      </View>

      {/* Available */}

      <AppText
        variant="caption"
        color="secondary"
        style={{
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        }}
      >
        Available
      </AppText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText
          variant="bodySmall"
          color="secondary"
        >
          {formatCurrency(minimumValue)}
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
        >
          {formatCurrency(maximumValue)}
        </AppText>
      </View>
    </View>
  );
}