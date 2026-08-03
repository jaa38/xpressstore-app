import { useEffect, useState } from "react";

import { Alert, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useOrders } from "@/hooks/products/useOrders";
import { useUpdateOrderStatus } from "@/hooks/orders/useUpdateOrderStatus";

import { Order } from "@/types/order";

import { OrderSummarySection } from "@/components/orders/OrderSummarySection";
import { OrderStatusCard } from "@/components/orders/OrderStatusCard";
import { CustomerInformationSection } from "@/components/orders/CustomerInformationSection";
import { OrderItemsSection } from "@/components/orders/OrderItemsSection";
import { OrderTotalsSection } from "@/components/orders/OrderTotalsSection";
import { PaymentInformationSection } from "@/components/orders/PaymentInformationSection";
import { OrderTimelineSection } from "@/components/orders/OrderTimelineSection";
import { OrderStatusHistorySection } from "@/components/orders/OrderStatusHistorySection";

import { UpdateOrderStatusBottomSheet } from "@/components/bottom-sheet/UpdateOrderStatusBottomSheet";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: orders = [] } = useOrders();

  const foundOrder = orders.find((item) => item.id === id);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(
    foundOrder ?? null
  );

  const [statusBottomSheetVisible, setStatusBottomSheetVisible] =
    useState(false);

  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (foundOrder) {
      setCurrentOrder(foundOrder);
    }
  }, [foundOrder]);

  if (!currentOrder) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <Ionicons
          name="receipt-outline"
          size={60}
          color={theme.icon.default.icon}
        />

        <AppText
          variant="h2"
          style={{
            marginTop: spacing.lg,
          }}
        >
          Order Not Found
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          align="center"
          style={{
            marginTop: spacing.sm,
            paddingHorizontal: spacing.xl,
          }}
        >
          The requested order could not be found.
        </AppText>
      </SafeAreaView>
    );
  }

  const order = currentOrder;

  async function handleUpdateStatus(status: Order["status"]) {
    try {
      await updateStatus.mutateAsync({
        orderId: order.id,
        status,
      });

      setCurrentOrder((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          status,
          updatedAt: new Date().toISOString(),
        };
      });

      setStatusBottomSheetVisible(false);

      Alert.alert("Success", "Order status updated successfully.");
    } catch (error) {
      Alert.alert(
        "Unable to Update Order",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="h1">Order</AppText>

            <AppText variant="body" color="secondary">
              Order Details
            </AppText>
          </View>
        </View>

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing["3xl"],
          }}
        >
          <OrderSummarySection order={order} />

          <CustomerInformationSection order={order} />

          <OrderStatusCard
            order={order}
            onUpdateStatus={() => setStatusBottomSheetVisible(true)}
          />

          <OrderItemsSection order={order} />

          <OrderTotalsSection order={order} />

          <PaymentInformationSection order={order} />

          <OrderTimelineSection order={order} />

          <OrderStatusHistorySection order={order} />
        </ScrollView>
      </View>

      <UpdateOrderStatusBottomSheet
        visible={statusBottomSheetVisible}
        order={order}
        loading={updateStatus.isPending}
        onClose={() => setStatusBottomSheetVisible(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </SafeAreaView>
  );
}
