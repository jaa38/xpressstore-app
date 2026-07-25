import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, radius, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

import type { Currency } from "@/types/currency";

export interface PaymentLink {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  amount: number;
  currency: Currency;
}

interface PaymentLinkRowProps {
  link: PaymentLink;

  icon: keyof typeof Ionicons.glyphMap;

  iconBackground: string;
  iconColor: string;

  badgeBackground: string;
  badgeBorderColor?: string;

  badgeText: string;

  badgeTextColor:
    | "success"
    | "warning"
    | "error"
    | "secondary";

  showDivider?: boolean;
}

export function PaymentLinkRow({
  link,
  icon,

  iconBackground,
  iconColor,

  badgeBackground,
  badgeBorderColor,

  badgeText,
  badgeTextColor,

  showDivider = false,
}: PaymentLinkRowProps) {
  return (
    <>
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
          <View
            style={{
              width: 48,
              height: 48,

              borderRadius: radius.full,

              justifyContent: "center",
              alignItems: "center",

              backgroundColor: iconBackground,
            }}
          >
            <Ionicons
              name={icon}
              size={22}
              color={iconColor}
            />
          </View>

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" numberOfLines={1}>
              {link.title}
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              numberOfLines={1}
            >
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
            justifyContent: "center",

            gap: spacing.sm,

            minWidth: 88,
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
            <AppText
              variant="caption"
              color={badgeTextColor}
            >
              {badgeText}
            </AppText>
          </View>
        </View>
      </View>

      {showDivider && <Divider />}
    </>
  );
}