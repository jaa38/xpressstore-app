import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface PaymentLinkActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;

  title: string;

  destructive?: boolean;

  onPress?: () => void;
}

export function PaymentLinkActionItem({
  icon,
  title,
  destructive = false,
  onPress,
}: PaymentLinkActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: spacing.md,

        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: spacing.md,
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={
            destructive
              ? theme.icon.delete.icon
              : theme.listItem.default.icon
          }
        />

        <AppText
          variant="bodyLarge"
          color={destructive ? "error" : "primary"}
        >
          {title}
        </AppText>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={
          destructive
            ? theme.listItem.destructive.chevron
            : theme.listItem.default.chevron
        }
      />
    </Pressable>
  );
}