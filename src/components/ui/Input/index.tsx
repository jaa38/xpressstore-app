import React, {
  useState,
} from "react";

import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";

import { theme } from "@/theme/theme";
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

export const Input = ({
  label,
  error,
  editable = true,
  onFocus,
  onBlur,
  style,
  rightIcon,
  ...props
}: InputProps) => {
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
    <View
      style={styles.container}
    >
      {label && (
        <Text
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          position:
            "relative",
        }}
      >
        <TextInput
          {...props}
          editable={editable}
          placeholderTextColor={
            theme.input
              .placeholder
          }
          style={[
            styles.input,
            getInputStateStyle(
              state
            ),
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
              position:
                "absolute",

              right: 16,

              top: 0,
              bottom: 0,

              justifyContent:
                "center",
            }}
          >
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text
          style={
            styles.errorText
          }
        >
          {error}
        </Text>
      )}
    </View>
  );
};

function getInputStateStyle(
  state: InputState
) {
  switch (state) {
    case "focus":
      return {
        borderColor:
          theme.input
            .focusBorder,
      };

    case "error":
      return {
        borderColor:
          theme.input
            .errorBorder,
      };

    case "disabled":
      return {
        borderColor:
          theme.input
            .border,

        backgroundColor:
          theme.input
            .disabledBackground,
      };

    default:
      return {
        borderColor:
          theme.input
            .border,
      };
  }
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    label: {
      ...typography.caption,

      color:
        theme.input.label,

      marginBottom: 8,
    },

    input: {
      height: 48,

      width: "100%",

      paddingVertical: 12,

      paddingHorizontal: 16,

      paddingRight: 48,

      borderWidth: 1,

      borderRadius:
        radius.md,

      color:
        theme.input.text,
    },

    errorText: {
      ...typography.caption,

      color:
        theme.text.error,

      marginTop: 4,
    },
  });