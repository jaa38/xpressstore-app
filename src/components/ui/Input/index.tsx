import { useState } from "react";

import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type InputVariant = "default" | "textarea";

type InputState = "default" | "focus" | "error" | "disabled";

interface InputProps extends TextInputProps {
  label?: string;

  required?: boolean;

  variant?: InputVariant;

  maxLength?: number;

  error?: string;

  helperText?: string;

  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  required = false,
  variant = "default",
  maxLength,
  error,
  helperText,
  rightIcon,
  editable = true,
  onFocus,
  onBlur,
  style,
  placeholder,
  value,
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

  const characterCount = value?.length ?? 0;
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
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
        </View>
      )}

      <View
        style={[
          styles.inputContainer,

          variant === "textarea" && styles.textareaContainer,

          getInputStateStyle(state),
        ]}
      >
        <TextInput
          {...props}
          value={value}
          maxLength={maxLength}
          multiline={variant === "textarea"}
          textAlignVertical={variant === "textarea" ? "top" : "center"}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={theme.input.placeholder}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: !editable,
          }}
          style={[
            styles.input,

            variant === "textarea" && styles.textareaInput,

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

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <View>
          {error ? (
            <AppText variant="caption" color="error" accessibilityRole="alert">
              {error}
            </AppText>
          ) : helperText ? (
            <AppText variant="caption" color="secondary">
              {helperText}
            </AppText>
          ) : null}
        </View>

        {maxLength && (
          <AppText variant="caption" color="secondary">
            {characterCount}/{maxLength}
          </AppText>
        )}
      </View>
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

    justifyContent: "space-between",

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

  textareaContainer: {
    minHeight: 120,

    alignItems: "flex-start",
  },

  input: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 16,

    color: theme.input.text,

    ...typography.body,
  },

  textareaInput: {
    minHeight: 120,

    paddingTop: 16,
  },

  iconContainer: {
    paddingRight: 16,
  },

  feedback: {
    marginTop: 4,
  },
});
