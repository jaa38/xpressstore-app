import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface ListActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;

  title: string;

  subtitle?: string;

  destructive?: boolean;

  showChevron?: boolean;

  onPress?: () => void;
}

export function ListActionItem({
  icon,
  title,
  subtitle,
  destructive = false,
  showChevron = true,
  onPress,
}: ListActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: spacing.md,

        backgroundColor: pressed
          ? theme.listItem.pressed.background
          : theme.listItem.default.background,
      })}
    >
      <View
        style={{
          flex: 1,
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
              ? theme.listItem.destructive.icon
              : theme.listItem.default.icon
          }
        />

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText
            variant="bodyLarge"
            color={destructive ? "error" : "primary"}
          >
            {title}
          </AppText>

          {subtitle && (
            <AppText
              variant="caption"
              color={destructive ? "error" : "secondary"}
            >
              {subtitle}
            </AppText>
          )}
        </View>
      </View>

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={
            destructive
              ? theme.listItem.destructive.chevron
              : theme.listItem.default.chevron
          }
        />
      )}
    </Pressable>
  );
}