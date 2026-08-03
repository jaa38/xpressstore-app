import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { OrderActionItem } from "@/components/orders/OrderActionItem";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

import { ORDER_STATUS } from "@/constants/orderStatus";
import { ORDER_ACTIONS } from "@/constants/orderActions";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

import { formatOrderDate } from "@/utils/formatOrderDate";

interface Props {
  order: Order;
  onUpdateStatus?: () => void;
}

export function OrderStatusCard({
  order,
  onUpdateStatus,
}: Props) {
  const status =
    ORDER_STATUS[order.status];

  const actions =
    ORDER_ACTIONS[order.status];

  const nextAction =
    actions[0]?.label ??
    "No further actions";

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
          Order Status
        </AppText>

        <AppText
          variant="bodySmall"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          Current order lifecycle
        </AppText>
      </View>

      <Divider />

      {/* Current Status */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText
          variant="bodySmall"
          color="secondary"
        >
          Current Status
        </AppText>

        <View
          style={{
            marginTop: spacing.md,
          }}
        >
          <OrderStatusBadge
            status={order.status}
            size="lg"
          />
        </View>
      </View>

      <Divider />

      {/* Last Updated */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,

            borderRadius: 999,

            justifyContent: "center",
            alignItems: "center",

            backgroundColor:
              theme.icon.default.background,
          }}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={
              theme.icon.default.icon
            }
          />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: spacing.md,
          }}
        >
          <AppText
            variant="bodySmall"
            color="secondary"
          >
            Last Updated
          </AppText>

          <AppText
            variant="bodyBold"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {formatOrderDate(
              order.updatedAt ??
                order.createdAt
            )}
          </AppText>
        </View>
      </View>

      <Divider />

      {/* Next Action */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,

            borderRadius: 999,

            justifyContent: "center",
            alignItems: "center",

            backgroundColor:
              theme.icon.branding.background,
          }}
        >
          <Ionicons
            name="flag-outline"
            size={20}
            color={
              theme.icon.branding.icon
            }
          />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: spacing.md,
          }}
        >
          <AppText
            variant="bodySmall"
            color="secondary"
          >
            Next Action
          </AppText>

          <AppText
            variant="bodyBold"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {nextAction}
          </AppText>
        </View>
      </View>

      {actions.length > 0 && (
        <>
          <Divider />

          <View
            style={{
              padding: spacing.lg,
            }}
          >
            <AppText
              variant="bodySmall"
              color="secondary"
            >
              Available Actions
            </AppText>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              {actions.map(
                (action, index) => (
                  <View
                    key={action.status}
                  >
                    <OrderActionItem
                      title={
                        action.label
                      }
                      subtitle={
                        action.description
                      }
                      icon={
                        ORDER_STATUS[
                          action.status
                        ].icon
                      }
                      destructive={
                        action.destructive
                      }
                      showDivider={
                        index !==
                        actions.length -
                          1
                      }
                      disabled
                    />
                  </View>
                )
              )}
            </View>
          </View>
        </>
      )}

      {onUpdateStatus && (
        <>
          <Divider />

          <View
            style={{
              padding: spacing.lg,
            }}
          >
            <OrderActionItem
              title="Update Status"
              subtitle="Change the current order status"
              icon="create-outline"
              showDivider={false}
              onPress={
                onUpdateStatus
              }
            />
          </View>
        </>
      )}
    </Card>
  );
}