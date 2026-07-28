import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

export type DropdownOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

interface SearchableDropdownProps<TValue extends string = string> {
  label?: string;

  required?: boolean;

  placeholder?: string;

  value?: TValue;

  disabled?: boolean;

  error?: string;

  options: DropdownOption<TValue>[];

  /**
   * Called when the dropdown is pressed.
   */
  onPress: () => void;
}

export function SearchableDropdown<TValue extends string = string>({
  label,
  required = false,
  placeholder = "Select option",
  value,
  disabled = false,
  error,
  options,
  onPress,
}: SearchableDropdownProps<TValue>) {
  const selected = options.find((item) => item.value === value);

  return (
    <>
      {label && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: spacing.sm,
          }}
        >
          <AppText variant="caption" color="secondary">
            {label}
          </AppText>

          {required && (
            <AppText
              variant="caption"
              style={{
                color: theme.text.error,
              }}
            >
              {" *"}
            </AppText>
          )}
        </View>
      )}

      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={{
          height: 48,

          borderWidth: 1,
          borderColor: error ? theme.input.errorBorder : theme.input.border,

          borderRadius: radius.md,

          paddingHorizontal: spacing.md,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          backgroundColor: disabled
            ? theme.input.disabledBackground
            : theme.input.background,
        }}
      >
        <AppText
          variant="body"
          style={{
            color: disabled
              ? theme.input.placeholder
              : selected
                ? theme.input.text
                : theme.input.placeholder,
          }}
        >
          {selected?.label ?? placeholder}
        </AppText>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? theme.input.disabledText : theme.input.icon}
        />
      </Pressable>

      {error && (
        <AppText
          variant="caption"
          color="error"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {error}
        </AppText>
      )}
    </>
  );
}
