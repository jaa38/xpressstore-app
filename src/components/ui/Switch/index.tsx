import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

interface SwitchProps {
  label: string;

  description?: string;

  value: boolean;

  onValueChange: (value: boolean) => void;
}

export function Switch({
  label,
  description,
  value,
  onValueChange,
}: SwitchProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingRight: spacing.md,
        }}
      >
        <AppText>{label}</AppText>

        {description && (
          <AppText
            variant="caption"
            color="secondary"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {description}
          </AppText>
        )}
      </View>

      <View
        style={{
          width: 48,
          height: 28,
          borderRadius: radius.full,
          backgroundColor: value
            ? theme.button.primary.background
            : theme.border.default,
          padding: 3,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: radius.full,
            backgroundColor: "#FFFFFF",
            alignSelf: value ? "flex-end" : "flex-start",
          }}
        />
      </View>
    </Pressable>
  );
}