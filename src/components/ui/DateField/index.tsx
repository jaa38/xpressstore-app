import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { formatDate } from "@/utils/formatDate";

interface DateFieldProps {
  label: string;
  value?: Date;
  onPress: () => void;
}

export function DateField({ label, value, onPress }: DateFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: theme.border.default,
        borderRadius: 12,
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
          color={theme.text.secondary}
        />
      </View>
    </Pressable>
  );
}
