import React from "react";

import { Switch, StyleSheet, View } from "react-native";

import { theme } from "@/theme";

interface ToggleSwitchProps {
  value: boolean;

  onChange: (value: boolean) => void;

  disabled?: boolean;
}

export function ToggleSwitch({
  value,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
