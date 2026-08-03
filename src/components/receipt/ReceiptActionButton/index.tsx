import { ActivityIndicator, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

interface ReceiptActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  loading?: boolean;
  onPress: () => void;
}

export function ReceiptActionButton({
  icon,
  title,
  loading = false,
  onPress,
}: ReceiptActionButtonProps) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,

        opacity: pressed ? 0.75 : 1,

        borderRadius: radius.lg,

        paddingVertical: spacing.md,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: theme.background.surface,
      })}
    >
      {loading ? (
        <ActivityIndicator color={theme.icon.branding.icon} />
      ) : (
        <>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.icon.branding.background,
            }}
          >
            <Ionicons name={icon} size={22} color={theme.icon.branding.icon} />
          </View>

          <AppText
            variant="bodySmallBold"
            style={{
              marginTop: spacing.sm,
            }}
          >
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}
