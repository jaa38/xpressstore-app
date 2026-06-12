import { useState } from "react";

import {
  Pressable,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type DropdownState =
  | "default"
  | "focus"
  | "error"
  | "disabled";

export type DropdownOption = {
  label: string;

  value: string;
};

interface DropdownProps {
  label?: string;

  placeholder?: string;

  value?: string;

  error?: string;

  disabled?: boolean;

  options: DropdownOption[];

  onSelect: (
    value: string
  ) => void;
}

export function Dropdown({
  label,
  placeholder = "Select option",
  value,
  error,
  disabled = false,
  options,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] =
    useState(false);

  const state: DropdownState =
    disabled
      ? "disabled"
      : error
        ? "error"
        : open
          ? "focus"
          : "default";

  const selectedOption =
    options.find(
      (option) =>
        option.value === value
    );

  return (
    <View style={styles.container}>
      {label && (
        <AppText
          variant="caption"
          color="secondary"
          style={{
            marginBottom: 8,
          }}
        >
          {label}
        </AppText>
      )}

      <Pressable
        disabled={disabled}
        onPress={() =>
          setOpen(!open)
        }
        style={[
          styles.dropdown,
          getDropdownStateStyle(
            state
          ),
        ]}
      >
        <AppText
          variant="body"
          style={{
            flex: 1,

            color: value
              ? theme.input.text
              : theme.input
                  .placeholder,
          }}
        >
          {selectedOption?.label ||
            placeholder}
        </AppText>

        <Ionicons
          name={
            open
              ? "chevron-up"
              : "chevron-down"
          }
          size={20}
          color={theme.input.icon}
        />
      </Pressable>

      {open && (
        <ScrollView
          style={
            styles.optionsContainer
          }
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {options.map(
            (option) => (
              <Pressable
                key={
                  option.value
                }
                onPress={() => {
                  onSelect(
                    option.value
                  );

                  setOpen(
                    false
                  );
                }}
                style={[
                  styles.option,

                  value ===
                    option.value && {
                    backgroundColor:
                      theme
                        .background
                        .brand,
                  },
                ]}
              >
                <AppText
                  variant="body"
                >
                  {option.label}
                </AppText>
              </Pressable>
            )
          )}
        </ScrollView>
      )}

      {error && (
        <AppText
          variant="caption"
          color="error"
          style={{
            marginTop: 4,
          }}
        >
          {error}
        </AppText>
      )}
    </View>
  );
}

function getDropdownStateStyle(
  state: DropdownState
) {
  switch (state) {
    case "focus":
      return {
        borderColor:
          theme.input
            .focusBorder,

        backgroundColor:
          theme.input
            .background,
      };

    case "error":
      return {
        borderColor:
          theme.input
            .errorBorder,

        backgroundColor:
          theme.input
            .background,
      };

    case "disabled":
      return {
        borderColor:
          theme.input.border,

        backgroundColor:
          theme.input
            .disabledBackground,
      };

    default:
      return {
        borderColor:
          theme.input.border,

        backgroundColor:
          theme.input
            .background,
      };
  }
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    dropdown: {
      height: 48,

      borderWidth: 1,

      borderRadius:
        radius.md,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      backgroundColor:
        "#FFFFFF",
    },

    optionsContainer: {
      marginTop: 4,

      maxHeight: 220,

      borderWidth: 1,

      borderColor:
        theme.input.border,

      borderRadius:
        radius.md,

      backgroundColor:
        "#FFFFFF",
    },

    option: {
      paddingHorizontal: 16,

      paddingVertical: 14,

      backgroundColor:
        "#FFFFFF",
    },

    value: {
      flex: 1,

      ...typography.body,
    },
  });