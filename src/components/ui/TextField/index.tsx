import { useState } from "react";

import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type InputState =
  | "default"
  | "focus"
  | "error"
  | "disabled";

interface TextFieldProps
  extends TextInputProps {
  label?: string;

  error?: string;

  helperText?: string;

  rightIcon?: React.ReactNode;
}

export function TextField({
  label,
  error,
  helperText,
  rightIcon,
  editable = true,
  onFocus,
  onBlur,
  style,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] =
    useState(false);

  const state: InputState =
    !editable
      ? "disabled"
      : error
      ? "error"
      : focused
      ? "focus"
      : "default";

  return (
    <View style={styles.container}>
      {label && (
        <AppText
          variant="caption"
          color="secondary"
          style={styles.label}
        >
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,

          getInputStateStyle(
            state
          ),
        ]}
      >
        <TextInput
          {...props}
          editable={editable}
          multiline
          textAlignVertical="top"
          placeholderTextColor={
            theme.input.placeholder
          }
          style={[
            styles.input,

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
          <View
            style={
              styles.iconContainer
            }
          >
            {rightIcon}
          </View>
        )}
      </View>

      {error ? (
        <AppText
          variant="caption"
          color="error"
          style={styles.feedback}
        >
          {error}
        </AppText>
      ) : helperText ? (
        <AppText
          variant="caption"
          color="secondary"
          style={styles.feedback}
        >
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

function getInputStateStyle(
  state: InputState
) {
  switch (state) {
    case "focus":
      return {
        borderColor:
          theme.input.focusBorder,

        backgroundColor:
          theme.input.background,
      };

    case "error":
      return {
        borderColor:
          theme.input.errorBorder,

        backgroundColor:
          theme.input.background,
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
          theme.input.background,
      };
  }
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    label: {
      marginBottom: 8,
    },

    /**
     * Text Field Container
     *
     * Min Height: 120px
     * Radius: 10px
     * Padding: 16px
     */
    inputContainer: {
      minHeight: 120,

      borderWidth: 1,

      borderRadius:
        radius.md,

      flexDirection: "row",
    },

    input: {
      flex: 1,

      minHeight: 120,

      paddingHorizontal: 16,
      paddingVertical: 16,

      color:
        theme.input.text,

      ...typography.body,
    },

    iconContainer: {
      paddingTop: 16,
      paddingRight: 16,
    },

    feedback: {
      marginTop: 4,
    },
  });