import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

import { theme } from "@/theme";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "tertiaryDestructive";

type ButtonSize = "large" | "medium" | "small";

interface ButtonProps {
  title: string;

  variant?: ButtonVariant;

  size?: ButtonSize;

  disabled?: boolean;

  loading?: boolean;

  onPress?: () => void;

  style?: ViewStyle;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

const BUTTON_SIZES = {
  large: {
    height: 56,
    paddingVertical: 16,
    paddingHorizontal: 20,
    textStyle: typography.buttonLarge,
  },

  medium: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    textStyle: typography.button,
  },

  small: {
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textStyle: typography.buttonSmall,
  },
};

function getVariantStyles({
  variant,
  pressed,
  disabled,
}: {
  variant: ButtonVariant;
  pressed: boolean;
  disabled: boolean;
}): ViewStyle {
  /**
   * Disabled
   */
  if (disabled) {
    return {
      backgroundColor: theme.action.primary.disabled,

      borderWidth:
        variant === "tertiary" || variant === "tertiaryDestructive" ? 1 : 0,

      borderColor:
        variant === "tertiary"
          ? theme.action.tertiary.border
          : variant === "tertiaryDestructive"
            ? theme.action.tertiaryDestructive.border
            : "transparent",
    };
  }

  switch (variant) {
    case "primary":
      return {
        backgroundColor: pressed
          ? theme.action.primary.pressed
          : theme.action.primary.background,
      };

    case "secondary":
      return {
        backgroundColor: pressed
          ? theme.action.secondary.pressed
          : theme.action.secondary.background,
      };

    case "tertiary":
      return {
        backgroundColor: pressed
          ? theme.action.tertiary.pressed
          : theme.action.tertiary.background,

        borderWidth: 1,
        borderColor: theme.action.tertiary.border,
      };

    case "tertiaryDestructive":
      return {
        backgroundColor: pressed
          ? theme.action.tertiaryDestructive.pressed
          : theme.action.tertiaryDestructive.background,

        borderWidth: 1,
        borderColor: theme.action.tertiaryDestructive.border,
      };
  }
}

function getTextColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return theme.action.primary.disabledText;
  }

  switch (variant) {
    case "primary":
      return theme.action.primary.text;

    case "secondary":
      return theme.action.secondary.text;

    case "tertiary":
      return theme.action.tertiary.text;

    case "tertiaryDestructive":
      return theme.action.tertiaryDestructive.text;
  }
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onPress,
  style,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const sizeStyles = BUTTON_SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={loading ? `${title} loading` : title}
      accessibilityState={{
        disabled: disabled || loading,
      }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: "auto",

          height: sizeStyles.height,

          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,

          borderRadius: radius.md,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },

        getVariantStyles({
          variant,
          pressed,
          disabled: disabled || loading,
        }),

        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor(variant, disabled || loading)}
        />
      ) : (
        <>
          {leftIcon}

          <Text
            style={[
              sizeStyles.textStyle,
              {
                color: getTextColor(variant, disabled),
                fontFamily: typography.fontFamily,
                marginHorizontal: leftIcon || rightIcon ? 6 : 0,
              } as TextStyle,
            ]}
          >
            {title}
          </Text>

          {rightIcon}
        </>
      )}
    </Pressable>
  );
}
