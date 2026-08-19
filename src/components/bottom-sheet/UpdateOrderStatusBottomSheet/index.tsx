import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { Alert } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import { OrderActionItem } from "@/components/orders/OrderActionItem";

import { ORDER_ACTIONS } from "@/constants/orderActions";
import { ORDER_STATUS } from "@/constants/orderStatus";

import type { Order } from "@/types/order";

import { radius, spacing, theme } from "@/theme";

interface UpdateOrderStatusBottomSheetProps {
  order: Order | null;
  loading?: boolean;
  onUpdateStatus: (status: Order["status"]) => void | Promise<void>;
}

export const UpdateOrderStatusBottomSheet = forwardRef<
  BottomSheetModal,
  UpdateOrderStatusBottomSheetProps
>(({ order, loading = false, onUpdateStatus }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["55%"], []);

  /**
   * ---------------------------------------------------------------------
   * EXPOSE REF
   * ---------------------------------------------------------------------
   */

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  /**
   * ---------------------------------------------------------------------
   * BACKDROP
   * ---------------------------------------------------------------------
   */

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
        enableTouchThrough={false}
      />
    ),
    []
  );

  /**
   * ---------------------------------------------------------------------
   * CLOSE
   * ---------------------------------------------------------------------
   */

  const dismissSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  /**
   * ---------------------------------------------------------------------
   * ACTIONS
   * ---------------------------------------------------------------------
   */

  const actions = useMemo(() => {
    if (!order) {
      return [];
    }

    return ORDER_ACTIONS[order.status];
  }, [order]);

  /**
   * ---------------------------------------------------------------------
   * NO ORDER
   * ---------------------------------------------------------------------
   */

  if (!order) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.background.surface,

        borderTopLeftRadius: radius["2xl"],

        borderTopRightRadius: radius["2xl"],
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.border.default,
      }}
    >
      {/* HEADER */}

      <BottomSheetHeader title="Update Order Status" onClose={dismissSheet} />

      {/* CONTENT */}

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingVertical: spacing.lg,

          paddingBottom: spacing["2xl"],
        }}
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
                        onPress: () => {
                          void onUpdateStatus(action.status);
                        },
                      },
                    ]);
                  }}
                />
              );
            })
          )}
        </BottomSheetSection>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
