import React from "react";

import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";

type UICardVariant = "default" | "active" | "status";

interface UICardProps {
  title: string;

  variant?: UICardVariant;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;
}

export function UICard({
  title,
  variant = "default",
  onPress,
  style,
}: UICardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, getVariantStyle(variant), style]}
    >
      <AppText style={[styles.text, getTextStyle(variant)]}>{title}</AppText>
    </Pressable>
  );
}

function getVariantStyle(variant: UICardVariant) {
  switch (variant) {
    case "active":
      return {
        backgroundColor: colors.primary[500],
        borderWidth: 0,
      };

    case "status":
      return {
        backgroundColor: colors.primary[200],
        borderWidth: 0,
      };

    default:
      return {
        backgroundColor: colors.neutral.white,

        borderWidth: 1,

        borderColor: colors.gray[300],
      };
  }
}

function getTextStyle(variant: UICardVariant) {
  switch (variant) {
    case "active":
      return {
        color: colors.neutral.white,
      };

    case "status":
      return {
        color: colors.primary[600],
      };

    default:
      return {
        color: colors.gray[800],
      };
  }
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "flex-start",

    height: 36,

    paddingHorizontal: 12,

    borderRadius: radius.lg,

    alignItems: "center",

    justifyContent: "center",
  },

  text: {
    fontSize: 14,

    lineHeight: 20,

    fontWeight: "600",

    letterSpacing: -0.1,
  },
});
