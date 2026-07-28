import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/theme";

interface FilterButtonProps {
  active?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FilterButton({
  active = false,
  onPress,
  icon = "options-outline",
}: FilterButtonProps) {
  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: active
          ? theme.action.primary.background
          : theme.background.surface,

        borderWidth: 1,
        borderColor: active
          ? theme.action.primary.background
          : theme.border.default,

        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? theme.action.primary.text : theme.icon.default.icon}
      />
    </Pressable>
  );
}
