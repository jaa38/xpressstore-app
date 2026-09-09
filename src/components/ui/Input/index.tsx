import { forwardRef, useState } from "react";

import type { ReactNode } from "react";

import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { typography } from "@/theme/typography";

import { radius } from "@/theme/radius";

type InputVariant = "default" | "textarea";

type InputState = "default" | "focus" | "error" | "disabled";

interface InputProps extends TextInputProps {
  label?: string;

  required?: boolean;

  optional?: boolean;

  variant?: InputVariant;

  maxLength?: number;

  error?: string;

  helperText?: string;

  leftElement?: ReactNode;

  rightElement?: ReactNode;

  rightIcon?: ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    required = false,
    variant = "default",
    optional = false,
    maxLength,
    error,
    helperText,
    leftElement,
    rightElement,
    rightIcon,
    editable = true,
    onFocus,
    onBlur,
    style,
    placeholder,
    value,
    ...props
  },
  ref
) {
  /**
   * ------------------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------------------
   */

  const [focused, setFocused] = useState(false);

  /**
   * ------------------------------------------------------------------------
   * INPUT STATE
   * ------------------------------------------------------------------------
   */

  const state: InputState = !editable
    ? "disabled"
    : error
      ? "error"
      : focused
        ? "focus"
        : "default";

  /**
   * ------------------------------------------------------------------------
   * ACCESSIBILITY
   * ------------------------------------------------------------------------
   */

  const accessibilityHint = error
    ? `Error. ${error}`
    : (helperText ?? placeholder ?? undefined);

  /**
   * ------------------------------------------------------------------------
   * CHARACTER COUNT
   * ------------------------------------------------------------------------
   */

  const characterCount = value?.length ?? 0;

  /**
   * ------------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------------
   */

  return (
    <View style={styles.container}>
      {/* ================================================================
            LABEL
        ================================================================= */}

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

            {optional && (
              <AppText
                variant="caption"
                color="secondary"
                style={{
                  marginLeft: 4,
                }}
              >
                (Optional)
              </AppText>
            )}
          </View>

          {maxLength && (
            <AppText variant="caption" color="secondary">
              {characterCount}/{maxLength}
            </AppText>
          )}
        </View>
      )}

      {/* ================================================================
            INPUT CONTAINER
        ================================================================= */}

      <View
        style={[
          styles.inputContainer,

          variant === "textarea" && styles.textareaContainer,

          getInputStateStyle(state),
        ]}
      >
        {leftElement}

        <TextInput
          ref={ref}
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
          onFocus={(event) => {
            setFocused(true);

            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);

            onBlur?.(event);
          }}
        />

        {rightElement}

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {/* ================================================================
            FEEDBACK
        ================================================================= */}

      {(error || helperText) && (
        <View
          style={{
            marginTop: 4,
          }}
        >
          {error ? (
            <AppText variant="caption" color="error" accessibilityRole="alert">
              {error}
            </AppText>
          ) : (
            <AppText variant="caption" color="secondary">
              {helperText}
            </AppText>
          )}
        </View>
      )}
    </View>
  );
});

Input.displayName = "Input";

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

    marginBottom: spacing.xs,
  },

  inputContainer: {
    height: 48,

    borderWidth: 1,

    borderRadius: radius.md,

    flexDirection: "row",

    alignItems: "center",
  },

  textareaContainer: {
    height: 120,

    alignItems: "flex-start",
  },

  input: {
    flex: 1,

    minWidth: 0,

    height: "100%",

    paddingHorizontal: 16,

    color: theme.input.text,

    ...typography.body,
  },

  textareaInput: {
    flex: 1,

    paddingTop: 16,

    paddingBottom: 16,
  },

  iconContainer: {
    paddingRight: 16,
  },
});
