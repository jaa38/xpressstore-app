import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { radius, spacing, theme } from "@/theme";

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
}

export function RadioGroup({ value, options, onChange }: RadioGroupProps) {
  return (
    <View>
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: spacing.md,
              borderBottomWidth: index === options.length - 1 ? 0 : 1,
              borderBottomColor: theme.border.default,
            }}
          >
            <AppText>{option.label}</AppText>

            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: radius.full,
                borderWidth: 2,
                borderColor: selected
                  ? theme.button.primary.background
                  : theme.border.default,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selected && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: radius.full,
                    backgroundColor: theme.button.primary.background,
                  }}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
