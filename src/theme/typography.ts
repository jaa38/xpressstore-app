import { TextStyle } from "react-native";

/**
 * 🔤 Storefront Typography Tokens
 */

export const typography = {
  /**
   * Font Family
   */
  fontFamily: "Inter",

  /**
   * 🖥️ DISPLAY
   */
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.5,
  } as TextStyle,

  /**
   * 🏷️ HEADINGS
   */
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600",
    letterSpacing: -0.4,
  } as TextStyle,

  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: -0.2,
  } as TextStyle,

  /**
   * 📄 BODY TEXT
   */
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: 0,
  } as TextStyle,

  bodyLargeBold: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: 0,
  } as TextStyle,

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0,
  } as TextStyle,

  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: 0,
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0,
  } as TextStyle,

  bodySmallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: 0,
  } as TextStyle,

  /**
   * 📝 LABELS
   */
  labelLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  /**
   * 🔘 BUTTON TEXT
   */
  buttonLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  buttonSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  } as TextStyle,

  /**
   * 🏷️ CAPTIONS
   */
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0.2,
  } as TextStyle,

  /**
   * 🔠 OVERLINE
   */
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  } as TextStyle,

  /**
   * 🪪 UI CARD
   */
  uiCardTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.1,
  } as TextStyle,

  /**
   * 📝 INPUT PLACEHOLDER
   */
  placeholder: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.1,
  } as TextStyle,
};