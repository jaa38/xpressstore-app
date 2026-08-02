import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

import { formatDateTime } from "@/utils/formatters/date";

interface Props {
  order: Order;
}

type TimelineState =
  | "completed"
  | "current"
  | "pending"
  | "error";

export function OrderTimelineSection({
  order,
}: Props) {
  const formattedDate = formatDateTime(
    new Date(order.createdAt)
  );

  const timeline = (() => {
    switch (order.status) {
      case "paid":
        return [
          {
            title: "Order Created",
            subtitle:
              "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Payment Received",
            subtitle:
              "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Ready for Delivery",
            subtitle: "Awaiting fulfilment.",
            icon: "time-outline",
            state: "current",
            date: "In Progress",
          },
        ];

      case "delivered":
        return [
          {
            title: "Order Created",
            subtitle:
              "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Payment Received",
            subtitle:
              "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Delivered",
            subtitle:
              "Order has been delivered.",
            icon: "cube-outline",
            state: "completed",
            date: formattedDate,
          },
        ];

      case "returned":
        return [
          {
            title: "Order Created",
            subtitle:
              "Customer placed this order.",
            icon: "receipt-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Payment Received",
            subtitle:
              "Payment completed successfully.",
            icon: "card-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Returned",
            subtitle:
              "Customer returned the order.",
            icon: "return-up-back-outline",
            state: "error",
            date: formattedDate,
          },
        ];

      case "failed":
        return [
          {
            title: "Order Created",
            subtitle:
              "Customer attempted checkout.",
            icon: "receipt-outline",
            state: "completed",
            date: formattedDate,
          },
          {
            title: "Payment Failed",
            subtitle:
              "Payment could not be processed.",
            icon: "close-circle-outline",
            state: "error",
            date: formattedDate,
          },
          {
            title: "Order Cancelled",
            subtitle:
              "Order was not created.",
            icon: "ban-outline",
            state: "pending",
            date: "Not Applicable",
          },
        ];
    }
  })() satisfies {
    title: string;
    subtitle: string;
    icon: React.ComponentProps<
      typeof Ionicons
    >["name"];
    state: TimelineState;
    date: string;
  }[];

  function getTimelineAppearance(
    state: TimelineState
  ) {
    switch (state) {
      case "completed":
        return {
          background:
            theme.state.success.background,
          icon: theme.icon.success.icon,
          text: theme.text.success,
          line: theme.state.success.background,
        };

      case "current":
        return {
          background:
            theme.icon.branding.background,
          icon: theme.icon.branding.icon,
          text: theme.text.brand,
          line: theme.icon.branding.background,
        };

      case "pending":
        return {
          background:
            theme.background.subtle,
          icon: theme.icon.default.icon,
          text: theme.text.secondary,
          line: theme.divider.default,
        };

      case "error":
        return {
          background:
            theme.state.error.background,
          icon: theme.icon.error.icon,
          text: theme.text.error,
          line: theme.state.error.background,
        };
    }
  }

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
          Order Timeline
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          Track the progress of this order.
        </AppText>
      </View>

      <Divider />

      {timeline.map((item, index) => {
        const appearance =
          getTimelineAppearance(item.state);

        return (
          <View key={item.title}>
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
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor:
                      appearance.background,

                    borderWidth: 1,
                    borderColor:
                      appearance.background,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={appearance.icon}
                  />
                </View>

                {index <
                  timeline.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 48,
                      marginTop: spacing.sm,
                      borderRadius: 999,
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
                  paddingBottom: spacing.lg,
                }}
              >
                <AppText
                  variant="bodyBold"
                  style={{
                    color: appearance.text,
                  }}
                >
                  {item.title}
                </AppText>

                <AppText
                  variant="bodySmall"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {item.subtitle}
                </AppText>

                <AppText
                  variant="caption"
                  color="muted"
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  {item.date}
                </AppText>
              </View>
            </View>

            {index <
              timeline.length - 1 && (
              <Divider />
            )}
          </View>
        );
      })}
    </Card>
  );
}