import { useEffect, useState } from "react";

import { Switch, View } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

interface AmountRangeFilterProps {
  min?: number;
  max?: number;

  minimumValue?: number;
  maximumValue?: number;

  onValueChange: (
    min?: number,
    max?: number
  ) => void;
}

export function AmountRangeFilter({
  min,
  max,
  minimumValue = 0,
  maximumValue = 500000,
  onValueChange,
}: AmountRangeFilterProps) {
  const [sliderWidth, setSliderWidth] = useState(0);

  const [enabled, setEnabled] = useState(
    min != null || max != null
  );

  const sliderMin = min ?? minimumValue;

  const sliderMax = max ?? maximumValue;

  useEffect(() => {
    setEnabled(min != null || max != null);
  }, [min, max]);

  return (
    <View>
      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.lg,
        }}
      >
        <AppText variant="bodyBold">
          Enable Amount Filter
        </AppText>

        <Switch
          value={enabled}
          trackColor={{
            false: theme.border.default,
            true: theme.action.primary.background,
          }}
          thumbColor={theme.background.primary}
          onValueChange={(value) => {
            setEnabled(value);

            if (!value) {
              onValueChange(undefined, undefined);
            } else {
              onValueChange(
                minimumValue,
                maximumValue
              );
            }
          }}
        />
      </View>

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
          marginBottom: spacing.md,
        }}
      >
        <AppText
          variant="bodyLargeBold"
          color={enabled ? "primary" : "secondary"}
        >
          {formatCurrency(sliderMin)}
        </AppText>

        <AppText
          variant="bodyLargeBold"
          color={enabled ? "primary" : "secondary"}
        >
          {formatCurrency(sliderMax)}
        </AppText>
      </View>

      {/* Slider */}

      <View
        style={{
          opacity: enabled ? 1 : 0.35,
        }}
        onLayout={(event) => {
          setSliderWidth(
            event.nativeEvent.layout.width
          );
        }}
      >
        {sliderWidth > 0 && (
          <MultiSlider
            enabledOne={enabled}
            enabledTwo={enabled}
            values={[sliderMin, sliderMax]}
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
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor:
                theme.background.primary,
            }}
            pressedMarkerStyle={{
              width: 26,
              height: 26,
              borderRadius: 13,
            }}
            onValuesChange={(values) => {
              if (!enabled) return;

              const [newMin, newMax] = values;

              if (
                newMin == null ||
                newMax == null
              ) {
                return;
              }

              onValueChange(newMin, newMax);
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
        Available Range
      </AppText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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