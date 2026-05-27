import { TextStyle } from "react-native";

/**
 * 🔤 Storefront Typography Tokens
 */

type TypographyStyles = {
  [key: string]: TextStyle;
};

export const typography: TypographyStyles = {
  /**
   * 🖥️ DISPLAY
   */
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  /**
   * 🏷️ HEADINGS
   */
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600",
    letterSpacing: -0.4,
  },

  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  /**
   * 📄 BODY TEXT
   */
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: 0,
  },

  bodyLargeBold: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: 0,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0,
  },

  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: 0,
  },

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0,
  },

  bodySmallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: 0,
  },

  /**
   * 📝 LABELS
   */
  labelLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  /**
   * 🔘 BUTTON TEXT
   */
  buttonLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  buttonSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  /**
   * 🏷️ CAPTIONS
   */
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  /**
   * 🔠 OVERLINE
   */
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  /**
   * 🪪 UI CARD
   */
  uiCardTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
};
