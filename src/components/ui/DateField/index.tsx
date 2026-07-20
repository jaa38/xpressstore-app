import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";

import { formatDate } from "@/utils/formatDate";

interface DateFieldProps {
  label: string;
  value?: Date;
  onPress: () => void;
  isActive?: boolean;
}

export function DateField({
  label,
  value,
  onPress,
  isActive = false,
}: DateFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: isActive ? theme.input.focusBorder : theme.border.default,
        backgroundColor: isActive
          ? theme.background.brand
          : theme.background.surface,
        borderRadius: radius.md,
        padding: spacing.md,
      }}
    >
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>

      <View
        style={{
          marginTop: spacing.xs,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText variant="body">
          {value ? formatDate(value) : "Select date"}
        </AppText>

        <Ionicons
          name="calendar-outline"
          size={20}
          color={
            isActive ? theme.action.primary.background : theme.text.secondary
          }
        />
      </View>
    </Pressable>
  );
}
