import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { TIMELINE_STATE } from "@/constants/timelineState";

export type TimelineState =
  | "completed"
  | "current"
  | "pending"
  | "error";

interface OrderTimelineItemProps {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];
  state: TimelineState;
  isLast?: boolean;
}

export function OrderTimelineItem({
  title,
  subtitle,
  icon,
  state,
  isLast = false,
}: OrderTimelineItemProps) {
  const appearance =
    TIMELINE_STATE[state];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      }}
    >
      {/* Timeline */}

      <View
        style={{
          alignItems: "center",
          marginRight: spacing.md,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,

            borderRadius: 999,

            justifyContent: "center",
            alignItems: "center",

            backgroundColor:
              appearance.background,
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={appearance.icon}
          />
        </View>

        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              minHeight: 36,
              marginTop: spacing.sm,

              backgroundColor:
                appearance.line,
            }}
          />
        )}
      </View>

      {/* Content */}

      <View
        style={{
          flex: 1,
          paddingBottom: spacing.md,
        }}
      >
        <AppText
          variant="bodyBold"
          style={{
            color: appearance.text,
          }}
        >
          {title}
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}