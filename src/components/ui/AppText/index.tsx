import { Text, TextProps, TextStyle } from "react-native";

import { fonts, theme, typography } from "@/theme";

type Variant =
  | "displayLarge"
  | "h1"
  | "h2"
  | "h3"
  | "bodyLarge"
  | "bodyLargeBold"
  | "body"
  | "bodyBold"
  | "bodySmall"
  | "bodySmallBold"
  | "labelLarge"
  | "label"
  | "labelSmall"
  | "buttonLarge"
  | "button"
  | "buttonSmall"
  | "caption"
  | "overline"
  | "uiCardTitle";

type Color =
  | "primary"
  | "heading"
  | "strong"
  | "secondary"
  | "muted"
  | "inverse"
  | "link"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "returned";

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
  align?: TextStyle["textAlign"];
}

export function AppText({
  children,
  variant = "body",
  color = "primary",
  align = "left",
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        typography[variant],

        {
          color: theme.text[color],
          textAlign: align,
          fontFamily: fonts.primary,
        },

        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
