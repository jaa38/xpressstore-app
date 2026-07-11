import { View, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  visible: boolean;

  type?: ToastType;

  title: string;

  message?: string;
}

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  success: {
    icon: "checkmark-circle",
    color: theme.state.success.icon,
  },

  error: {
    icon: "close-circle",
    color: theme.state.error.icon,
  },

  warning: {
    icon: "warning",
    color: theme.state.warning.icon,
  },

  info: {
    icon: "information-circle",
    color: theme.icon.branding.icon,
  },
};

export function Toast({
  visible,
  type = "success",
  title,
  message,
}: ToastProps) {
  if (!visible) {
    return null;
  }

  const config = TOAST_CONFIG[type];

  return (
    <View
      style={[
        styles.container,
        {
          borderLeftColor: config.color,
        },
      ]}
    >
      <Ionicons name={config.icon} size={24} color={config.color} />

      <View
        style={{
          flex: 1,
          marginLeft: spacing.md,
        }}
      >
        <AppText variant="bodyLargeBold">{title}</AppText>

        {!!message && (
          <AppText
            variant="bodySmall"
            color="secondary"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {message}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    left: spacing.lg,

    right: spacing.lg,

    bottom: spacing.xl,

    flexDirection: "row",

    alignItems: "flex-start",

    padding: spacing.lg,

    borderRadius: radius.lg,

    borderLeftWidth: 6,

    backgroundColor: theme.background.surface,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,

    zIndex: 999,
  },
});
