import { useState } from "react";

import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type InputState = "default" | "focus" | "error" | "disabled";

interface TextFieldProps extends TextInputProps {
  label?: string;

  error?: string;

  helperText?: string;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

export function TextField({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  editable = true,
  onFocus,
  onBlur,
  style,
  multiline = false,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const state: InputState = !editable
    ? "disabled"
    : error
      ? "error"
      : focused
        ? "focus"
        : "default";

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="caption" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          getInputStateStyle(state),
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          {...props}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : undefined}
          placeholderTextColor={theme.input.placeholder}
          style={[
            styles.input,
            multiline ? styles.multilineInput : styles.singleLineInput,
            style,
          ]}
          onFocus={(e) => {
            setFocused(true);

            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);

            onBlur?.(e);
          }}
        />

        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {error ? (
        <AppText variant="caption" color="error" style={styles.feedback}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" color="secondary" style={styles.feedback}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

function getInputStateStyle(state: InputState) {
  switch (state) {
    case "focus":
      return {
        borderColor: theme.input.focusBorder,

        backgroundColor: theme.input.background,
      };

    case "error":
      return {
        borderColor: theme.input.errorBorder,

        backgroundColor: theme.input.background,
      };

    case "disabled":
      return {
        borderColor: theme.input.border,

        backgroundColor: theme.input.disabledBackground,
      };

    default:
      return {
        borderColor: theme.input.border,

        backgroundColor: theme.input.background,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,

    borderWidth: 1,

    borderRadius: radius.md,

    flexDirection: "row",

    alignItems: "center",
  },

  multilineContainer: {
    minHeight: 120,

    height: 120,

    alignItems: "flex-start",
  },

  input: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 12,

    color: theme.input.text,

    ...typography.body,
  },

  singleLineInput: {
    paddingVertical: 0,
  },

  multilineInput: {
    paddingVertical: 16,

    textAlignVertical: "top",
  },

  leftIconContainer: {
    paddingLeft: 16,

    justifyContent: "center",

    alignItems: "center",
  },

  rightIconContainer: {
    paddingRight: 16,

    justifyContent: "center",

    alignItems: "center",
  },

  feedback: {
    marginTop: 4,
  },
});
