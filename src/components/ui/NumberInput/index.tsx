import {
  forwardRef,
  useState,
} from "react";

import {
  TextInput,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from "react-native";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type InputState =
  | "default"
  | "focus"
  | "error"
  | "disabled";

interface NumberInputProps
  extends Omit<
    TextInputProps,
    "onChangeText"
  > {
  value: string;

  onChangeText: (
    value: string
  ) => void;

  error?: boolean;
}

export const NumberInput =
  forwardRef<
    TextInput,
    NumberInputProps
  >(
    (
      {
        value,
        onChangeText,
        error = false,
        editable = true,
        onFocus,
        onBlur,
        style,
        ...props
      },
      ref
    ) => {
      const [
        focused,
        setFocused,
      ] = useState(false);

      const state: InputState =
        !editable
          ? "disabled"
          : error
          ? "error"
          : focused
          ? "focus"
          : "default";

      return (
        <TextInput
          ref={ref}
          {...props}
          value={value}
          editable={editable}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          placeholder="-"
          placeholderTextColor={
            theme.input.placeholder
          }
          onChangeText={
            onChangeText
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
      );
    }
  );

NumberInput.displayName =
  "NumberInput";

function getInputStateStyle(
  state: InputState
): TextStyle {
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
          theme.input
            .background,
      };
  }
}

const styles =
  StyleSheet.create({
    input: {
      width: 42,

      height: 48,

      borderWidth: 1,

      borderRadius:
        radius.md,

      textAlign: "center",

      color:
        theme.input.text,

      ...typography.body,
    },
  });