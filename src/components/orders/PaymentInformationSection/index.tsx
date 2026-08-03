import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { ORDER_STATUS } from "@/constants/orderStatus";
import { PAYMENT_CHANNEL_ICONS } from "@/types/payment";

import { Order } from "@/types/order";

import { formatOrderDate } from "@/utils/formatOrderDate";

interface Props {
  order: Order;
}

export function PaymentInformationSection({
  order,
}: Props) {
  const status =
    ORDER_STATUS[order.status];

  const paymentChannelLabels: Record<
    Order["paymentChannel"],
    string
  > = {
    bank: "Bank",
    card: "Card",
    bankTransfer: "Bank Transfer",
    nqr: "NQR",
    ussd: "USSD",
  };

  const rows: {
    label: string;
    value: string;
    icon: React.ComponentProps<
      typeof Ionicons
    >["name"];
    valueColor?: string;
  }[] = [
    {
      label: "Reference",
      value: order.reference,
      icon: "document-text-outline",
    },
    {
      label: "Payment Channel",
      value:
        paymentChannelLabels[
          order.paymentChannel
        ],
      icon:
        PAYMENT_CHANNEL_ICONS[
          order.paymentChannel
        ],
    },
    {
      label: "Status",
      value: status.label,
      icon: status.icon,
      valueColor: status.textColor,
    },
    {
      label: "Currency",
      value: order.currency,
      icon: "cash-outline",
    },
    {
      label: "Date",
      value: formatOrderDate(
        order.createdAt
      ),
      icon: "calendar-outline",
    },
  ];

  return (
    <Card
      style={{
        marginTop: spacing.lg,
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">
          Payment Information
        </AppText>
      </View>

      <Divider />

      {rows.map((row, index) => (
        <View key={row.label}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal:
                spacing.lg,
              paddingVertical:
                spacing.md,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,

                borderRadius: 999,

                justifyContent:
                  "center",

                alignItems: "center",

                backgroundColor:
                  theme.icon.default
                    .background,
              }}
            >
              <Ionicons
                name={row.icon}
                size={20}
                color={
                  row.label === "Status"
                    ? status.iconColor
                    : theme.icon.default
                        .icon
                }
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft:
                  spacing.md,
              }}
            >
              <AppText
                variant="bodySmall"
                color="secondary"
              >
                {row.label}
              </AppText>

              <AppText
                variant="bodyBold"
                style={{
                  marginTop:
                    spacing.xs,

                  color:
                    row.valueColor,
                }}
              >
                {row.value}
              </AppText>
            </View>
          </View>

          {index <
            rows.length - 1 && (
            <Divider />
          )}
        </View>
      ))}
    </Card>
  );
}