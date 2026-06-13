import { View, Pressable } from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

interface AddProductHeaderProps {
  title: string;

  step: number;

  totalSteps: number;

  progress: number;

  label: string;
}

export function AddProductHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
}: AddProductHeaderProps) {
  return (
    <>
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
          {/* Top Row */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={router.back} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>

            <AppText variant="h3">{title}</AppText>

            <Pressable
              onPress={() => router.replace(ROUTES.PRODUCTS)}
              hitSlop={12}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          </View>

          {/* Step Row */}

          <View
            style={{
              marginTop: spacing.rg,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AppText variant="bodySmall" color="secondary">
              Step {step} of {totalSteps}
            </AppText>

            <AppText variant="bodySmallBold" color="success">
              {label}
            </AppText>
          </View>

          {/* Progress */}

          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={progress} />
          </View>
        </View>
      </View>

      <Divider />
    </>
  );
}
