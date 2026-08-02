import { Alert, Linking } from "react-native";
import { router } from "expo-router";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import { OrderActionItem } from "@/components/orders/OrderActionItem";

import { Order } from "@/types/order";

import { getOrderDetailsRoute } from "@/navigation/routes";

interface Props {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

export function OrderActionsBottomSheet({ visible, order, onClose }: Props) {
  if (!order) {
    return null;
  }

  const currentOrder = order;

  async function handleCallCustomer() {
    const url = `tel:${currentOrder.customerPhone}`;

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        "Unable to place call",
        "Calling is not available on this device."
      );

      return;
    }

    await Linking.openURL(url);

    onClose();
  }

  async function handleWhatsApp() {
    const phone = currentOrder.customerPhone.replace(/\D/g, "");

    const url = `https://wa.me/${phone}`;

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("WhatsApp unavailable", "WhatsApp is not installed.");

      return;
    }

    await Linking.openURL(url);

    onClose();
  }

  return (
    <BottomSheet visible={visible} title="Order Actions" onClose={onClose}>
      {/* Order */}

      <BottomSheetSection title="Order">
        <OrderActionItem
          title="View Order"
          subtitle="Open the full order details"
          icon="eye-outline"
          onPress={() => {
            onClose();

            router.push(getOrderDetailsRoute(currentOrder.id));
          }}
        />

        <OrderActionItem
          title="View Receipt"
          subtitle="Open payment receipt"
          icon="receipt-outline"
          showDivider={currentOrder.status === "paid"}
          onPress={() => {
            onClose();

            Alert.alert(
              "Coming Soon",
              "Receipt viewer will be available shortly."
            );
          }}
        />
      </BottomSheetSection>

      {/* Customer */}

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
          showDivider={!!currentOrder.customerEmail}
          onPress={handleWhatsApp}
        />

        {currentOrder.customerEmail ? (
          <OrderActionItem
            title="Email Customer"
            subtitle={currentOrder.customerEmail}
            icon="mail-outline"
            showDivider={false}
            onPress={async () => {
              const url = `mailto:${currentOrder.customerEmail}`;

              const supported = await Linking.canOpenURL(url);

              if (!supported) {
                Alert.alert(
                  "Unable to send email",
                  "No email application is available."
                );

                return;
              }

              await Linking.openURL(url);

              onClose();
            }}
          />
        ) : null}
      </BottomSheetSection>

      {/* Payments */}

      <BottomSheetSection title="Payments">
        <OrderActionItem
          title="Refund Payment"
          subtitle="Available after backend integration"
          icon="return-up-back-outline"
          destructive
          disabled
          showDivider={false}
        />
      </BottomSheetSection>
    </BottomSheet>
  );
}
