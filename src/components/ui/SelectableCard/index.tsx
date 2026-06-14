import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface SelectableCardProps {
  title: string;

  description: string;

  selected?: boolean;

  icon?: keyof typeof Ionicons.glyphMap;

  onPress?: () => void;
}

export function SelectableCard({
  title,
  description,
  selected = false,
  icon,
  onPress,
}: SelectableCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card
        variant={selected ? "active" : "default"}
        style={{
          position: "relative",
        }}
      >
        {/* Selection Indicator */}
        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={theme.icon.branding.icon}
            style={{
              position: "absolute",
              top: spacing.sm,
              right: spacing.sm,
            }}
          />
        )}

        {/* Content */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={
                  selected
                    ? theme.icon.branding.icon
                    : theme.icon.default.icon
                }
              />
            )}

            <AppText
              variant="bodyLargeBold"
              color="primary"
            >
              {title}
            </AppText>
          </View>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {description}
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
}