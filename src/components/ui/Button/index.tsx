import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

import { colors } from "@/theme/colors";

import { typography } from "@/theme/typography";

import { radius } from "@/theme/radius";

type ButtonVariant = "primary" | "secondary" | "tertiary";

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
   * DISABLED
   */

  if (disabled) {
    return {
      backgroundColor: colors.gray[300],

      borderWidth: variant === "tertiary" ? 1 : 0,

      borderColor: variant === "tertiary" ? colors.gray[300] : "transparent",
    };
  }

  /**
   * PRIMARY
   */

  if (variant === "primary") {
    return {
      backgroundColor: pressed ? colors.primary[700] : colors.primary[500],
    };
  }

  /**
   * SECONDARY
   */

  if (variant === "secondary") {
    return {
      backgroundColor: pressed ? colors.secondary[700] : colors.secondary[500],
    };
  }

  /**
   * TERTIARY
   */

  return {
    backgroundColor: colors.neutral.white,

    borderWidth: 1,

    borderColor: colors.gray[300],
  };
}

function getTextColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return colors.neutral.white;
  }

  if (variant === "tertiary") {
    return colors.primary[500];
  }

  return colors.neutral.white;
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

          alignItems: "center",

          justifyContent: "center",

          flexDirection: "row",
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

                marginHorizontal: 6,
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
