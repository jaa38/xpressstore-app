import { useState } from "react";

import { Alert } from "react-native";
import { router } from "expo-router";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import { OrderActionItem } from "@/components/orders/OrderActionItem";

import { Order } from "@/types/order";

import {
  downloadOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

interface Props {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

export function OrderActionsBottomSheet({
  visible,
  order,
  onClose,
}: Props) {
  const [loadingAction, setLoadingAction] = useState<
    "share" | "download" | null
  >(null);

  if (!order) {
    return null;
  }

  const currentOrder = order;

  async function handleCallCustomer() {
    Alert.alert(
      "Unavailable",
      "Customer phone numbers are not currently available."
    );
  }

  async function handleWhatsApp() {
    Alert.alert(
      "Unavailable",
      "Customer phone numbers are not currently available."
    );
  }

  async function handleShareReceipt() {
    try {
      setLoadingAction("share");

      await shareOrderReceipt(currentOrder);

      onClose();
    } catch (error) {
      Alert.alert(
        "Unable to Share Receipt",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDownloadReceipt() {
    try {
      setLoadingAction("download");

      const path = await downloadOrderReceipt(
        currentOrder
      );

      Alert.alert(
        "Receipt Saved",
        `Receipt successfully generated.\n\n${path}`
      );

      onClose();
    } catch (error) {
      Alert.alert(
        "Unable to Download Receipt",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <BottomSheet
      visible={visible}
      title="Order Actions"
      onClose={onClose}
    >
      <BottomSheetSection title="Order">
        <OrderActionItem
          title="View Order"
          subtitle="Open the full order details"
          icon="eye-outline"
          onPress={() => {
            onClose();

            router.push({
              pathname: "/orders/[id]",
              params: {
                id: currentOrder.id,
              },
            });
          }}
        />

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

      <BottomSheetSection title="Customer">
        <OrderActionItem
          title="Call Customer"
          subtitle={currentOrder.customerName}
          icon="call-outline"
          onPress={handleCallCustomer}
        />

        <OrderActionItem
          title="WhatsApp Customer"
          subtitle={currentOrder.customerName}
          icon="logo-whatsapp"
          iconColor="#25D366"
          showDivider={false}
          onPress={handleWhatsApp}
        />
      </BottomSheetSection>

      {/* <BottomSheetSection title="Payments">
        <OrderActionItem
          title="Refund Payment"
          subtitle="Available after backend integration"
          icon="return-up-back-outline"
          destructive
          disabled
          showDivider={false}
        />
      </BottomSheetSection> */}
    </BottomSheet>
  );
}