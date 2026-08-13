import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";

import { spacing, radius, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkCardProps {
  link: PaymentLink;

  badgeBackground: string;
  badgeBorderColor?: string;

  badgeText: string;

  badgeTextColor:
    | "success"
    | "warning"
    | "error"
    | "secondary";

  onMorePress?: (
    link: PaymentLink
  ) => void;
}

export function PaymentLinkCard({
  link,
  badgeBackground,
  badgeBorderColor,
  badgeText,
  badgeTextColor,
  onMorePress,
}: PaymentLinkCardProps) {
  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Left */}

        <View
          style={{
            flex: 1,

            flexDirection: "row",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
          {/* Payment Link Icon */}

          <View
            style={{
              width: 64,
              height: 64,

              borderRadius: radius.md,

              justifyContent: "center",
              alignItems: "center",

              backgroundColor:
                theme.icon.branding.background,
            }}
          >
            <Ionicons
              name="link-outline"
              size={28}
              color={theme.icon.branding.icon}
            />
          </View>

          <View
            style={{
              flex: 1,

              gap: spacing.xs,
            }}
          >
            <AppText
              variant="bodyBold"
              numberOfLines={1}
            >
              {link.name}
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              numberOfLines={1}
            >
              {link.paymentLink}
            </AppText>

            <AppText
              variant="caption"
              color="muted"
            >
              {link.createdAt
                ? formatDate(
                    new Date(link.createdAt)
                  )
                : "-"}
            </AppText>
          </View>
        </View>

        {/* Right */}

        <View
          style={{
            alignItems: "flex-end",

            alignSelf: "stretch",

            minWidth: 90,

            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyLargeBold">
            {formatCurrency(link.amount, {
              currency: link.currency,
            })}
          </AppText>

          <View
            style={{
              paddingHorizontal: spacing.sm,

              paddingVertical: spacing.xs,

              borderRadius: radius.full,

              backgroundColor: badgeBackground,

              borderWidth:
                badgeBorderColor ? 1 : 0,

              borderColor: badgeBorderColor,
            }}
          >
            <AppText
              variant="caption"
              color={badgeTextColor}
            >
              {badgeText}
            </AppText>
          </View>

          <Pressable
            hitSlop={10}
            onPress={() =>
              onMorePress?.(link)
            }
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={theme.text.primary}
            />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}