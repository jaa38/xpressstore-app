import { View, Pressable, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { SearchBar } from "@/components/ui/SearchBar";

import { UICard } from "@/components/ui/UICard";

import { spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";

import { PAYMENT_CHANNELS } from "@/constants/paymentChannels";

import type { Order } from "@/types/order";

import { formatCurrency } from "@/utils/formatCurrency";

const orders: Order[] = [
  {
    id: "1",
    reference: "XP-12345",
    customerName: "Nancy Drew",
    image: "",
    total: 20,
    currency: "USD",
    itemCount: 2,
    productName: "Ankara Tote Bag",
    paymentChannel: "card",
    status: "paid",
    createdAt: "Today, 10:24",
  },
  {
    id: "2",
    reference: "XP-12346",
    customerName: "John Smith",
    image: "",
    total: 45,
    currency: "USD",
    itemCount: 1,
    productName: "Sneakers",
    paymentChannel: "bankTransfer",
    status: "returned",
    createdAt: "Today, 09:40",
  },
  {
    id: "3",
    reference: "XP-12347",
    customerName: "Sarah Johnson",
    image: "",
    total: 18,
    currency: "USD",
    itemCount: 3,
    productName: "Backpack",
    paymentChannel: "bank",
    status: "failed",
    createdAt: "Yesterday, 17:05",
  },
  {
    id: "4",
    reference: "XP-12348",
    customerName: "Michael Brown",
    image: "",
    total: 60,
    currency: "USD",
    itemCount: 5,
    productName: "Office Chair",
    paymentChannel: "nqr",
    status: "delivered",
    createdAt: "Yesterday, 14:30",
  },
];

export default function OrdersScreen() {
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
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <View style={{}}>
              <AppText variant="h1">Orders</AppText>

              <AppText variant="body" color="secondary">
                Number of orders this week
              </AppText>
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <SearchBar placeholder="Search orders" />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: spacing.md,
                justifyContent: "space-between",
              }}
            >
              {/* <UICard /> */}
              <UICard title="All" variant="active" />
              <UICard title="Paid" />
              <UICard title="Delivered" />
              <UICard title="Returned" />
              <UICard title="Failed" />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "column",
                gap: spacing.md,
              }}
            >
              {orders.map((order) => (
                <Card key={order.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                    }}
                  >
                    {/* IMAGE */}

                    <Image
                      source={
                        order.image?.trim()
                          ? { uri: order.image }
                          : require("../../assets/images/ankara-tote-bag.png")
                      }
                      resizeMode="cover"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                      }}
                    />

                    {/* ORDER INFO */}

                    <View
                      style={{
                        flex: 1,
                        gap: spacing.xs,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.xs,
                        }}
                      >
                        <AppText variant="bodySmall" color="secondary">
                          {order.reference}
                        </AppText>

                        {order.status === "paid" ? (
                          <Ionicons
                            name={PAYMENT_CHANNELS[order.paymentChannel].icon}
                            size={16}
                            color={theme.icon.success.icon}
                          />
                        ) : order.status === "delivered" ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={theme.icon.success.icon}
                          />
                        ) : order.status === "returned" ? (
                          <Ionicons
                            name="return-down-back"
                            size={16}
                            color={theme.orderStatus.returned.text}
                          />
                        ) : (
                          <Ionicons
                            name="close-circle-outline"
                            size={16}
                            color={theme.orderStatus.failed.text}
                          />
                        )}
                      </View>

                      <AppText variant="bodyLargeBold">
                        {order.customerName}
                      </AppText>

                      <AppText
                        variant="bodySmall"
                        color="secondary"
                        numberOfLines={1}
                      >
                        {order.itemCount} item
                        {order.itemCount === 1 ? "" : "s"} • {order.productName}
                      </AppText>
                    </View>

                    {/* PRICE */}

                    <View
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        alignSelf: "stretch",
                      }}
                    >
                      <AppText variant="bodySmall" color="secondary">
                        {order.createdAt}
                      </AppText>

                      <AppText
                        color={
                          order.status === "failed"
                            ? "error"
                            : order.status === "returned"
                              ? "returned"
                              : "success"
                        }
                        variant="bodyLargeBold"
                      >
                        {formatCurrency(order.total, order.currency)}
                      </AppText>

                      <Pressable hitSlop={10}>
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={20}
                          color={theme.text.primary}
                        />
                      </Pressable>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* BOTTOM */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          ></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
