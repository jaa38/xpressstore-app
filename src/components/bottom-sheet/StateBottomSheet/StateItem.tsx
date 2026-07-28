import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { StateOption } from "@/constants/address";

interface Props {
  item: StateOption;
  selected: boolean;
  onPress: () => void;
}

export function StateItem({
  item,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: selected
          ? theme.background.brand
          : theme.background.surface,
      }}
    >
      <AppText
        variant="body"
        style={{
          color: selected
            ? theme.action.primary.background
            : theme.text.primary,
        }}
      >
        {item.label}
      </AppText>

      {selected && (
        <Ionicons
          name="checkmark"
          size={20}
          color={theme.action.primary.background}
        />
      )}
    </Pressable>
  );
}