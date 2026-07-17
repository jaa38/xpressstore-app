import { View, Pressable, Image, FlatList, RefreshControl } from "react-native";

import { useMemo, useState } from "react";

import type { OrderFilter } from "@/types/order-filter";

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

import { ORDER_STATUS } from "@/constants/orderStatus";
import { useOrders } from "@/hooks/useOrders";

import { formatOrderDate } from "@/utils/formatOrderDate";

export default function OrdersScreen() {
  const { data: orders = [], isLoading, isRefetching, refetch } = useOrders();

  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedFilter === "all" || order.status === selectedFilter;

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        order.reference.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  if (isLoading) {
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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <AppText variant="body">Loading orders...</AppText>
        </View>
      </SafeAreaView>
    );
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
        {/* TOP */}

        <View
          style={{
            flex: 1,
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
            <SearchBar
              placeholder="Search orders"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.md,
              justifyContent: "space-between",
            }}
          >
            {/* <UICard /> */}
            <UICard
              title="All"
              variant={selectedFilter === "all" ? "active" : "default"}
              onPress={() => setSelectedFilter("all")}
            />

            <UICard
              title="Paid"
              variant={selectedFilter === "paid" ? "active" : "default"}
              onPress={() => setSelectedFilter("paid")}
            />

            <UICard
              title="Delivered"
              variant={selectedFilter === "delivered" ? "active" : "default"}
              onPress={() => setSelectedFilter("delivered")}
            />

            <UICard
              title="Returned"
              variant={selectedFilter === "returned" ? "active" : "default"}
              onPress={() => setSelectedFilter("returned")}
            />

            <UICard
              title="Failed"
              variant={selectedFilter === "failed" ? "active" : "default"}
              onPress={() => setSelectedFilter("failed")}
            />
          </View>

          <FlatList
            style={{
              flex: 1,
            }}
            data={filteredOrders}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={theme.text.brand}
                colors={[theme.text.brand]}
              />
            }
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View
                style={{
                  paddingVertical: spacing.xl,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={48}
                  color={theme.icon.default.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  No orders yet
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  Orders will appear here when customers make purchases.
                </AppText>
              </View>
            }
            contentContainerStyle={{
              marginTop: spacing.lg,
              gap: spacing.md,
              paddingBottom: spacing.lg,
            }}
            renderItem={({ item: order }) => {
              const status =
                order.status !== "paid" ? ORDER_STATUS[order.status] : null;

              return (
                <Card>
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

                        <Ionicons
                          name={
                            order.status === "paid"
                              ? PAYMENT_CHANNELS[order.paymentChannel].icon
                              : status!.icon
                          }
                          size={16}
                          color={
                            order.status === "paid"
                              ? theme.icon.success.icon
                              : status!.iconColor
                          }
                        />
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
                        {formatOrderDate(order.createdAt)}
                      </AppText>

                      <AppText
                        color={
                          order.status === "paid"
                            ? "success"
                            : status!.amountColor
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
              );
            }}
          />
        </View>

        {/* BOTTOM */}

        {/* <View
          style={{
            paddingBottom: spacing.lg,
          }}
        ></View> */}
      </View>
    </SafeAreaView>
  );
}
