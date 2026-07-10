import React from "react";

import { View, Pressable } from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

type ScreenHeaderProps = {
  title: string;

  subtitle?: string;

  progress?: number;

  rightLabel?: string;

  showBackButton?: boolean;

  showCloseButton?: boolean;

  onBack?: () => void;

  onClose?: () => void;

  rightComponent?: React.ReactNode;
};

export function ScreenHeader({
  title,

  subtitle,

  progress,

  rightLabel,

  showBackButton = true,

  showCloseButton = false,

  onBack,

  onClose,

  rightComponent,
}: ScreenHeaderProps) {
  return (
    <View
      style={{
        backgroundColor: theme.background.surface,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
      }}
    >
      <View
        style={{
          gap: spacing.xs,
        }}
      >
        {/* Header Row */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Back Button */}

          {showBackButton ? (
            <Pressable
              hitSlop={12}
              onPress={() => {
                if (onBack) {
                  onBack();
                } else {
                  router.back();
                }
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          ) : (
            <View
              style={{
                width: 24,
              }}
            />
          )}

          {/* Title */}

          <AppText variant="h3">{title}</AppText>

          {/* Right Side */}

          {rightComponent ? (
            rightComponent
          ) : showCloseButton ? (
            <Pressable
              hitSlop={12}
              onPress={onClose}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          ) : (
            <View
              style={{
                width: 24,
              }}
            />
          )}
        </View>

        {/* Subtitle Row */}

        {(subtitle || rightLabel) && (
          <View
            style={{
              marginTop: spacing.rg,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AppText
              variant="bodySmall"
              color="secondary"
            >
              {subtitle}
            </AppText>

            {rightLabel ? (
              <AppText
                variant="bodySmallBold"
                color="success"
              >
                {rightLabel}
              </AppText>
            ) : (
              <View />
            )}
          </View>
        )}

        {/* Progress */}

        {progress !== undefined && (
          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={progress} />
          </View>
        )}
      </View>
    </View>
  );
}