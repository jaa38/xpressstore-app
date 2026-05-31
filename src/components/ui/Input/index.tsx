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

interface InputProps
  extends TextInputProps {
  label?: string;

  error?: string;

  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  rightIcon,
  editable = true,
  onFocus,
  onBlur,
  style,
  ...props
}: InputProps) {
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
          style={{
            marginBottom: 8,
          }}
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
            style={{
              paddingRight: 16,
            }}
          >
            {rightIcon}
          </View>
        )}
      </View>

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
          theme.input.disabledBackground,
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

    inputContainer: {
      height: 48,

      borderWidth: 1,

      borderRadius:
        radius.md,

      flexDirection: "row",

      alignItems: "center",
    },

    input: {
      flex: 1,

      height: "100%",

      paddingHorizontal: 16,

      color:
        theme.input.text,

      ...typography.body,
    },
  });