import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { ProductImage } from "@/components/ui/ProductImage";

import { spacing, radius, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkCardProps {
  link: PaymentLink;

  badgeBackground: string;
  badgeBorderColor?: string;

  badgeText: string;

  badgeTextColor: "success" | "warning" | "error" | "secondary";

  onMorePress?: (link: PaymentLink) => void;
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
          <ProductImage image={link.image} size={64} />

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" numberOfLines={1}>
              {link.title}
            </AppText>

            <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
              {link.url}
            </AppText>

            <AppText variant="caption" color="muted">
              {link.createdAt}
            </AppText>
          </View>
        </View>

        {/* Right */}

        <View
          style={{
            alignItems: "flex-end",
            // justifyContent: "space-between",
            alignSelf: "stretch",
            minWidth: 88,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyLargeBold">
            {formatCurrency(link.amount, {
              currency: link.currency,
              showDecimals: link.amount % 1 !== 0,
            })}
          </AppText>

          <View
            style={{
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,

              borderRadius: radius.full,

              backgroundColor: badgeBackground,

              borderWidth: badgeBorderColor ? 1 : 0,
              borderColor: badgeBorderColor,
            }}
          >
            <AppText variant="caption" color={badgeTextColor}>
              {badgeText}
            </AppText>
          </View>

          <Pressable hitSlop={10} onPress={() => onMorePress?.(link)}>
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
