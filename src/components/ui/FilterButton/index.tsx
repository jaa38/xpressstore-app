import { Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/theme";

interface FilterButtonProps {
  onPress: () => void;
}

export function FilterButton({ onPress }: FilterButtonProps) {
  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: theme.background.surface,

        borderWidth: 1,
        borderColor: theme.border.default,
      }}
    >
      <Ionicons
        name="options-outline"
        size={22}
        color={theme.icon.default.icon}
      />
    </Pressable>
  );
}
