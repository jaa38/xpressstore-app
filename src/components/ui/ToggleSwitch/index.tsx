import React from "react";

import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";

/**
 * ============================================================================
 * TOGGLE OPTION
 * ============================================================================
 */

interface ToggleOption {
  label: string;

  value: string;

  disabled?: boolean;
}

/**
 * ============================================================================
 * OPTION TOGGLE PROPS
 * ============================================================================
 */

interface OptionToggleSwitchProps {
  label?: string;

  value: string;

  options: ToggleOption[];

  onChange: (value: string) => void;

  fullWidth?: boolean;
}

/**
 * ============================================================================
 * NATIVE SWITCH PROPS
 * ============================================================================
 */

interface NativeToggleSwitchProps {
  value: boolean;

  onChange: (value: boolean) => void;

  disabled?: boolean;
}

/**
 * ============================================================================
 * TOGGLE SWITCH PROPS
 * ============================================================================
 *
 * The component supports two modes:
 *
 * 1. Option mode
 *    - Used by ID verification
 *    - value is a string
 *    - options are provided
 *
 * 2. Native switch mode
 *    - Used by Storefront Status
 *    - value is a boolean
 *    - options are omitted
 * ============================================================================
 */

type ToggleSwitchProps = OptionToggleSwitchProps | NativeToggleSwitchProps;

/**
 * ============================================================================
 * TOGGLE SWITCH
 * ============================================================================
 */

export function ToggleSwitch(props: ToggleSwitchProps) {
  /**
   * --------------------------------------------------------------------------
   * NATIVE SWITCH MODE
   * --------------------------------------------------------------------------
   *
   * When no options are supplied, render the React Native Switch.
   */

  if ("options" in props) {
    return <OptionToggleSwitch {...props} />;
  }

  return <NativeToggleSwitch {...props} />;
}

/**
 * ============================================================================
 * OPTION TOGGLE
 * ============================================================================
 */

function OptionToggleSwitch({
  label,
  value,
  options,
  onChange,
  fullWidth = false,
}: OptionToggleSwitchProps) {
  const renderOption = (option: ToggleOption) => {
    const isActive = option.value === value;

    return (
      <Pressable
        key={option.value}
        disabled={option.disabled}
        onPress={() => onChange(option.value)}
        style={[
          styles.button,

          fullWidth && styles.fullWidthButton,

          isActive && styles.activeButton,

          option.disabled && styles.disabledButton,
        ]}
      >
        <AppText
          variant="button"
          style={{
            color: isActive ? theme.text.inverse : theme.text.primary,
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
        <AppText variant="caption" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}

      {fullWidth ? (
        <View style={styles.toggleContainer}>{options.map(renderOption)}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toggleContainer}
        >
          {options.map(renderOption)}
        </ScrollView>
      )}
    </View>
  );
}

/**
 * ============================================================================
 * NATIVE TOGGLE
 * ============================================================================
 */

function NativeToggleSwitch({
  value,
  onChange,
  disabled = false,
}: NativeToggleSwitchProps) {
  return (
    <View style={styles.nativeContainer}>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        /**
         * iOS
         */
        trackColor={{
          false: theme.background.subtle,
          true: theme.action.primary.background,
        }}
        thumbColor={theme.background.surface}
        /**
         * Android
         */
        ios_backgroundColor={theme.background.subtle}
      />
    </View>
  );
}

/**
 * ============================================================================
 * STYLES
 * ============================================================================
 */

const styles = StyleSheet.create({
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

    borderRadius: radius.md,

    backgroundColor: theme.background.subtle,

    flexDirection: "row",

    gap: 8,
  },

  /**
   * Inactive Button
   */

  button: {
    minWidth: 80,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 16,
    paddingVertical: 8,

    borderRadius: radius.md,

    backgroundColor: theme.background.subtle,
  },

  /**
   * Active Button
   */

  activeButton: {
    backgroundColor: theme.action.primary.background,
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

  /**
   * Native Switch
   */

  nativeContainer: {
    justifyContent: "center",

    alignItems: "center",
  },
});
