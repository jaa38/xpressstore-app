import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

type Props = {
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  destructive?: boolean;
  disabled?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
};

export function OrderActionItem({
  title,
  subtitle,
  icon,
  iconColor = theme.icon.default.icon,
  destructive = false,
  disabled = false,
  showDivider = true,
  onPress,
}: Props) {
  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        })}
      >
        {/* Icon */}

        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: destructive
              ? theme.icon.delete.background
              : theme.icon.default.background,
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              destructive
                ? theme.icon.delete.icon
                : iconColor
            }
          />
        </View>

        {/* Content */}

        <View
          style={{
            flex: 1,
            marginLeft: spacing.md,
          }}
        >
          <AppText
            variant="bodyBold"
            color={destructive ? "error" : "primary"}
          >
            {title}
          </AppText>

          {subtitle ? (
            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.icon.default.icon}
        />
      </Pressable>

      {showDivider && <Divider />}
    </>
  );
}