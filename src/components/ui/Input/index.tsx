import { useState } from "react";

import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type InputState = "default" | "focus" | "error" | "disabled";

interface InputProps extends TextInputProps {
  label?: string;

  required?: boolean;

  error?: string;

  helperText?: string;

  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  required = false,
  error,
  helperText,
  rightIcon,
  editable = true,
  onFocus,
  onBlur,
  style,
  placeholder,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const state: InputState = !editable
    ? "disabled"
    : error
      ? "error"
      : focused
        ? "focus"
        : "default";

  const accessibilityHint = error
    ? `Error. ${error}`
    : (helperText ?? placeholder ?? undefined);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
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

      <View style={[styles.inputContainer, getInputStateStyle(state)]}>
        <TextInput
          {...props}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={theme.input.placeholder}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: !editable,
          }}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);

            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);

            onBlur?.(e);
          }}
        />

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error ? (
        <AppText
          variant="caption"
          color="error"
          style={styles.feedback}
          accessibilityRole="alert"
        >
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

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 8,
  },

  inputContainer: {
    height: 48,

    borderWidth: 1,

    borderRadius: radius.md,

    flexDirection: "row",

    alignItems: "center",
  },

  input: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 16,

    color: theme.input.text,

    ...typography.body,
  },

  iconContainer: {
    paddingRight: 16,
  },

  feedback: {
    marginTop: 4,
  },
});
