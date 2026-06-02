import React from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";

interface ToggleOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ToggleSwitchProps {
  label?: string;

  value: string;

  options: ToggleOption[];

  onChange: (
    value: string
  ) => void;

  /**
   * When true, options
   * share available width equally.
   *
   * Best for:
   * - Yes / No
   * - Active / Inactive
   * - Pickup / Delivery
   */
  fullWidth?: boolean;
}

export function ToggleSwitch({
  label,

  value,

  options,

  onChange,

  fullWidth = false,
}: ToggleSwitchProps) {
  const renderOption = (
    option: ToggleOption
  ) => {
    const isActive =
      option.value === value;

    return (
      <Pressable
        key={option.value}
        disabled={option.disabled}
        onPress={() =>
          onChange(option.value)
        }
        style={[
          styles.button,

          fullWidth &&
            styles.fullWidthButton,

          isActive &&
            styles.activeButton,

          option.disabled &&
            styles.disabledButton,
        ]}
      >
        <AppText
          variant="button"
          style={{
            color: isActive
              ? theme.text.inverse
              : theme.text.primary,
          }}
        >
          {option.label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <AppText
          variant="caption"
          color="secondary"
          style={
            styles.label
          }
        >
          {label}
        </AppText>
      )}

      {fullWidth ? (
        <View
          style={
            styles.toggleContainer
          }
        >
          {options.map(
            renderOption
          )}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.toggleContainer
          }
        >
          {options.map(
            renderOption
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    /**
     * Label
     */
    label: {
      marginBottom: 8,
    },

    /**
     * Toggle Container
     *
     * Height: 48px
     * Width: 100%
     * Radius: 10px
     * Padding: 4px
     * Gap: 8px
     */
    toggleContainer: {
      height: 48,

      width: "100%",

      paddingVertical: 4,
      paddingHorizontal: 4,

      borderRadius:
        radius.md,

      backgroundColor:
        theme.background
          .subtle,

      flexDirection:
        "row",

      gap: 8,
    },

    /**
     * Inactive Button
     */
    button: {
      minWidth: 80,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 16,
      paddingVertical: 8,

      borderRadius:
        radius.md,

      backgroundColor:
        theme.background
          .subtle,
    },

    /**
     * Active Button
     */
    activeButton: {
      backgroundColor:
        theme.action.primary
          .background,
    },

    /**
     * Full Width Mode
     */
    fullWidthButton: {
      flex: 1,
      minWidth: undefined,
    },

    /**
     * Disabled
     */
    disabledButton: {
      opacity: 0.5,
    },
  });