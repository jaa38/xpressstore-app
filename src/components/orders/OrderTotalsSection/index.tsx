import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { Order } from "@/types/order";

import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  order: Order;
}

export function OrderTotalsSection({
  order,
}: Props) {
  const subtotal = order.items.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  /**
   * Placeholder values until backend support.
   */
  const deliveryFee = 0;

  const discount = 0;

  const vat = 0;

  const total = order.total;

  const rows = [
    {
      label: "Subtotal",
      value: subtotal,
    },
    {
      label: "Delivery Fee",
      value: deliveryFee,
    },
    {
      label: "Discount",
      value: discount,
    },
    {
      label: "VAT",
      value: vat,
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
          Order Totals
        </AppText>
      </View>

      <Divider />

      {rows.map((row) => (
        <View
          key={row.label}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <AppText
            variant="body"
            color="secondary"
          >
            {row.label}
          </AppText>

          <AppText variant="bodyBold">
            {formatCurrency(row.value, {
              currency: order.currency,
            })}
          </AppText>
        </View>
      ))}

      <Divider />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
        }}
      >
        <AppText variant="h3">
          Total Paid
        </AppText>

        <AppText variant="h2">
          {formatCurrency(total, {
            currency: order.currency,
          })}
        </AppText>
      </View>
    </Card>
  );
}