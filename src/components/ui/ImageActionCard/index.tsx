import React from "react";

import { Pressable, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { theme, spacing } from "@/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

type ImageActionCardSize = "sm" | "md" | "lg";

interface ImageActionCardProps {
  title: string;

  icon: IoniconName;

  size?: ImageActionCardSize;

  disabled?: boolean;

  selected?: boolean;

  onPress?: () => void;
}

const SIZE_MAP = {
  sm: 80,
  md: 110,
  lg: 140,
};

export function ImageActionCard({
  title,
  icon,
  size = "md",
  disabled = false,
  selected = false,
  onPress,
}: ImageActionCardProps) {
  const cardSize = SIZE_MAP[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        pressed &&
          !disabled && {
            opacity: 0.8,
            transform: [{ scale: 0.98 }],
          },
      ]}
    >
      <Card
        fullWidth={false}
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize,
          },

          disabled && {
            backgroundColor: theme.card.disabled.background,
          },

          selected && {
            borderWidth: 2,
            borderColor: theme.card.active.border,
            backgroundColor: theme.card.active.background,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={
            disabled ? theme.action.primary.disabled : theme.icon.branding.icon
          }
        />

        <AppText
          variant="caption"
          color={disabled ? "muted" : "primary"}
          style={styles.label}
        >
          {title}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  label: {
    textAlign: "center",
  },
});
