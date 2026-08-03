import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

interface ReceiptErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function ReceiptErrorState({
  title = "Unable to Load Receipt",
  message = "Something went wrong while generating the receipt. Please try again.",
  onRetry,
}: ReceiptErrorStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            theme.state.error.background,
        }}
      >
        <Ionicons
          name="warning-outline"
          size={40}
          color={theme.icon.error.icon}
        />
      </View>

      <AppText
        variant="h2"
        align="center"
        style={{
          marginTop: spacing.lg,
        }}
      >
        {title}
      </AppText>

      <AppText
        variant="body"
        align="center"
        color="secondary"
        style={{
          marginTop: spacing.sm,
        }}
      >
        {message}
      </AppText>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,

          marginTop: spacing.xl,

          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,

          borderRadius: radius.lg,

          backgroundColor:
            theme.action.primary.background,
        })}
      >
        <AppText color="inverse">
          Try Again
        </AppText>
      </Pressable>
    </View>
  );
}