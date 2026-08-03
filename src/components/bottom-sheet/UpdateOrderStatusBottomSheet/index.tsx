import { useMemo } from "react";
import { Alert } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import { OrderActionItem } from "@/components/orders/OrderActionItem";

import { ORDER_ACTIONS } from "@/constants/orderActions";
import { ORDER_STATUS } from "@/constants/orderStatus";

import { Order } from "@/types/order";

interface Props {
  visible: boolean;
  order: Order | null;
  loading?: boolean;
  onClose: () => void;
  onUpdateStatus: (status: Order["status"]) => void | Promise<void>;
}

export function UpdateOrderStatusBottomSheet({
  visible,
  order,
  loading = false,
  onClose,
  onUpdateStatus,
}: Props) {
  const actions = useMemo(() => {
    if (!order) {
      return [];
    }

    return ORDER_ACTIONS[order.status];
  }, [order]);

  if (!order) {
    return null;
  }

  return (
    <BottomSheet
      visible={visible}
      title="Update Order Status"
      onClose={onClose}
    >
      <BottomSheetSection title="Available Actions">
        {actions.length === 0 ? (
          <OrderActionItem
            title="No Available Actions"
            subtitle="This order is already in its final state."
            icon="checkmark-done-outline"
            disabled
            showDivider={false}
          />
        ) : (
          actions.map((action, index) => {
            const status = ORDER_STATUS[action.status];

            return (
              <OrderActionItem
                key={action.status}
                title={action.label}
                subtitle={action.description}
                icon={status.icon}
                destructive={action.destructive}
                disabled={loading}
                showDivider={index !== actions.length - 1}
                onPress={() => {
                  Alert.alert(action.label, action.description, [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Continue",
                      style: action.destructive ? "destructive" : "default",
                      onPress: async () => {
                        await onUpdateStatus(action.status);

                        onClose();
                      },
                    },
                  ]);
                }}
              />
            );
          })
        )}
      </BottomSheetSection>
    </BottomSheet>
  );
}
