import { forwardRef, useCallback, useMemo, useState } from "react";

import { Alert, View } from "react-native";

import { router } from "expo-router";

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { OrderActionItem } from "@/components/orders/OrderActionItem";

import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import type { Order } from "@/types/order";

import {
  downloadOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

import { radius, spacing, theme } from "@/theme";

interface OrderActionsBottomSheetProps {
  order: Order | null;
  onDismiss?: () => void;
}

type LoadingAction = "share" | "download" | null;

export const OrderActionsBottomSheet = forwardRef<
  BottomSheetModal,
  OrderActionsBottomSheetProps
>(({ order, onDismiss }, ref) => {
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  /**
   * -----------------------------------------------------------------------
   * SNAP POINTS
   * -----------------------------------------------------------------------
   */

  const snapPoints = useMemo(() => ["55%"], []);

  /**
   * -----------------------------------------------------------------------
   * BACKDROP
   * -----------------------------------------------------------------------
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
   * -----------------------------------------------------------------------
   * CLOSE
   * -----------------------------------------------------------------------
   */

  const dismissSheet = useCallback(() => {
    ref && typeof ref !== "function" && ref.current?.dismiss();
  }, [ref]);

  /**
   * -----------------------------------------------------------------------
   * CALL CUSTOMER
   * -----------------------------------------------------------------------
   */

  const handleCallCustomer = () => {
    Alert.alert(
      "Unavailable",
      "Customer phone numbers are not currently available."
    );
  };

  /**
   * -----------------------------------------------------------------------
   * WHATSAPP CUSTOMER
   * -----------------------------------------------------------------------
   */

  const handleWhatsApp = () => {
    Alert.alert(
      "Unavailable",
      "Customer phone numbers are not currently available."
    );
  };

  /**
   * -----------------------------------------------------------------------
   * SHARE RECEIPT
   * -----------------------------------------------------------------------
   */

  const handleShareReceipt = async () => {
    if (!order) {
      return;
    }

    try {
      setLoadingAction("share");

      await shareOrderReceipt(order);

      dismissSheet();
    } catch (error) {
      Alert.alert(
        "Unable to Share Receipt",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  /**
   * -----------------------------------------------------------------------
   * DOWNLOAD RECEIPT
   * -----------------------------------------------------------------------
   */

  const handleDownloadReceipt = async () => {
    if (!order) {
      return;
    }

    try {
      setLoadingAction("download");

      const path = await downloadOrderReceipt(order);

      Alert.alert(
        "Receipt Saved",
        `Receipt successfully generated.\n\n${path}`
      );

      dismissSheet();
    } catch (error) {
      Alert.alert(
        "Unable to Download Receipt",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  /**
   * -----------------------------------------------------------------------
   * VIEW ORDER
   * -----------------------------------------------------------------------
   */

  const handleViewOrder = () => {
    if (!order) {
      return;
    }

    dismissSheet();

    router.push({
      pathname: "/orders/[id]",
      params: {
        id: order.id,
      },
    });
  };

  /**
   * -----------------------------------------------------------------------
   * NO ORDER
   * -----------------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Do not return null when `order` is null.
   *
   * The parent needs the BottomSheetModal to be mounted so that:
   *
   * orderActionsBottomSheetRef.current?.present()
   *
   * has a mounted component to target.
   *
   * The sheet can simply render an empty state until an order is selected.
   * -----------------------------------------------------------------------
   */

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
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

      <BottomSheetHeader title="Order Actions" onClose={dismissSheet} />

      {order ? (
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            paddingBottom: spacing["2xl"],
          }}
        >
          {/* =========================================================
                ORDER
            ========================================================= */}

          <BottomSheetSection title="Order">
            {/* VIEW ORDER */}

            <OrderActionItem
              title="View Order"
              subtitle="Open the full order details"
              icon="eye-outline"
              onPress={handleViewOrder}
            />

            {/* SHARE RECEIPT */}

            <OrderActionItem
              title={
                loadingAction === "share"
                  ? "Sharing Receipt..."
                  : "Share Receipt"
              }
              subtitle="Share PDF receipt"
              icon="share-social-outline"
              disabled={loadingAction !== null}
              onPress={handleShareReceipt}
            />

            {/* DOWNLOAD RECEIPT */}

            <OrderActionItem
              title={
                loadingAction === "download"
                  ? "Downloading Receipt..."
                  : "Download Receipt"
              }
              subtitle="Save receipt as PDF"
              icon="download-outline"
              disabled={loadingAction !== null}
              showDivider={false}
              onPress={handleDownloadReceipt}
            />
          </BottomSheetSection>

          {/* =========================================================
                CUSTOMER
            ========================================================= */}

          <BottomSheetSection title="Customer">
            {/* CALL CUSTOMER */}

            <OrderActionItem
              title="Call Customer"
              subtitle={order.customerName}
              icon="call-outline"
              onPress={handleCallCustomer}
            />

            {/* WHATSAPP CUSTOMER */}

            <OrderActionItem
              title="WhatsApp Customer"
              subtitle={order.customerName}
              icon="logo-whatsapp"
              iconColor="#25D366"
              showDivider={false}
              onPress={handleWhatsApp}
            />
          </BottomSheetSection>
        </BottomSheetScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
          }}
        />
      )}
    </BottomSheetModal>
  );
});

OrderActionsBottomSheet.displayName = "OrderActionsBottomSheet";
