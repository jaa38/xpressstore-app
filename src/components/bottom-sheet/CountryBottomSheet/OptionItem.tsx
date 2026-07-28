import { Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { DropdownOption } from "@/components/ui/Dropdown/SearchableDropdown";

interface CountryItemProps<TValue extends string = string> {
  item: DropdownOption<TValue>;
  selected: boolean;
  onPress: () => void;
}

export function CountryItem<TValue extends string = string>({
  item,
  selected,
  onPress,
}: CountryItemProps<TValue>) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

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