import {
  Pressable,
  View,
  Alert,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";
import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { useMemo, useRef, useState } from "react";

import { FilterButton } from "@/components/ui/FilterButton";

import type { CustomerSort } from "@/types/customer-sort";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { CustomerSortBottomSheet } from "@/components/bottom-sheet/CustomerSortBottomSheet";

import { useCustomers } from "@/hooks/customers/useCustomers";

import { ROUTES } from "@/navigation/routes";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useDeleteCustomer } from "@/hooks/customers/useDeleteCustomer";
import { Customer } from "@/types/customer";

function RightActions({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: theme.action.destructive.background,

        borderRadius: radius.md,
      }}
    >
      <Ionicons
        name="trash-outline"
        size={24}
        color={theme.action.destructive.text}
      />

      <AppText color="inverse">Delete</AppText>
    </Pressable>
  );
}

export default function CustomersScreen() {
  const phoneNumber = "+23493322201234";

  const {
    data: customers = [],
    isLoading,
    isRefetching,
    refetch,
  } = useCustomers();

  const deleteCustomerMutation = useDeleteCustomer();

  async function handleCall(phone: string) {
    const url = `tel:${phone}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to place call");
    }
  }

  async function handleWhatsApp(phone: string) {
    const url = `https://wa.me/${phone.replace(/\D/g, "")}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp is not installed.");
    }
  }

  const customerSortBottomSheetRef = useRef<BottomSheetModal>(null);

  const onRefresh = async () => {
    await refetch();
  };

  const [sortBy, setSortBy] = useState<CustomerSort>("firstNameAsc");

  const [draftSort, setDraftSort] = useState<CustomerSort>("firstNameAsc");

  const sortedCustomers = useMemo(() => {
    const data = [...customers];

    switch (sortBy) {
      case "firstNameAsc":
        return data.sort((a, b) => {
          const aName = a.name.split(" ")[0] ?? "";
          const bName = b.name.split(" ")[0] ?? "";

          return aName.localeCompare(bName);
        });

      case "firstNameDesc":
        return data.sort((a, b) => {
          const aName = a.name.split(" ")[0] ?? "";
          const bName = b.name.split(" ")[0] ?? "";

          return bName.localeCompare(aName);
        });

      case "highestSpent":
        return data.sort((a, b) => b.spent - a.spent);

      case "lowestSpent":
        return data.sort((a, b) => a.spent - b.spent);

      case "mostOrders":
        return data.sort((a, b) => b.orders - a.orders);

      case "leastOrders":
        return data.sort((a, b) => a.orders - b.orders);

      default:
        return data;
    }
  }, [customers, sortBy]);

  function handleDelete(customer: Customer) {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to permanently delete "${customer.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCustomerMutation.mutate(customer.id, {
              onSuccess: () => {
                Alert.alert(
                  "Customer Deleted",
                  `"${customer.name}" has been deleted.`
                );
              },

              onError: (error) => {
                Alert.alert(
                  "Delete Failed",
                  error.message ?? "Unable to delete customer."
                );
              },
            });
          },
        },
      ]
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
          // paddingTop: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* Back Button */}

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

            {/* Title */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Customers</AppText>

              <AppText variant="body" color="secondary">
                {customers.length} customer{customers.length !== 1 ? "s" : ""}
              </AppText>
            </View>

            {/* Add Button */}

            <Pressable
              onPress={() => router.push(ROUTES.ADD_CUSTOMER)}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.action.primary.background,
              }}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* CONTENT */}

          {/* Search */}
          <View
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <SearchBar />
            </View>
            <FilterButton
              active={sortBy !== "firstNameAsc"}
              onPress={() => {
                setDraftSort(sortBy);
                customerSortBottomSheetRef.current?.present();
              }}
            />
          </View>
          {sortedCustomers.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="people-outline"
                size={72}
                color={theme.icon.default.icon}
              />

              <AppText variant="h3" style={{ marginTop: spacing.md }}>
                No customers yet
              </AppText>

              <AppText
                variant="body"
                color="secondary"
                style={{ textAlign: "center", marginTop: spacing.xs }}
              >
                Tap the + button to create your first customer.
              </AppText>
            </View>
          ) : (
            <ScrollView
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: spacing.md,
                paddingBottom: spacing["2xl"],
              }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={onRefresh}
                  tintColor={theme.action.primary.background}
                  colors={[theme.action.primary.background]}
                />
              }
            >
              {sortedCustomers.map((customer) => (
                <Swipeable
                  key={customer.id}
                  renderRightActions={() => (
                    <RightActions
                      onDelete={() => {
                        if (!deleteCustomerMutation.isPending) {
                          handleDelete(customer);
                        }
                      }}
                    />
                  )}
                >
                  <Card>
                    {/* Customer */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="person-circle"
                        size={56}
                        color={theme.icon.default.icon}
                      />

                      <View style={{ flex: 1 }}>
                        <AppText variant="h3">{customer.name}</AppText>

                        <AppText variant="body" color="secondary">
                          {customer.phone}
                        </AppText>
                      </View>
                    </View>

                    <Divider
                      style={{
                        marginVertical: spacing.rg,
                      }}
                    />

                    {/* Summary */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          gap: spacing.md,
                        }}
                      >
                        <View>
                          <AppText variant="label" color="secondary">
                            Orders
                          </AppText>

                          <AppText variant="bodyBold">
                            {customer.orders}
                          </AppText>
                        </View>

                        <View>
                          <AppText variant="label" color="secondary">
                            Spent
                          </AppText>

                          <AppText variant="bodyBold">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              maximumFractionDigits: 0,
                            }).format(customer.spent)}
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.sm,
                        }}
                      >
                        <Pressable
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: radius.full,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: theme.background.subtle,
                          }}
                          onPress={() => handleCall(customer.phone)}
                        >
                          <Ionicons
                            name="call-outline"
                            size={22}
                            color={theme.icon.default.icon}
                          />
                        </Pressable>

                        <Pressable
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: radius.full,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#25D36615",
                          }}
                          onPress={() => handleWhatsApp(customer.phone)}
                        >
                          <Ionicons
                            name="logo-whatsapp"
                            size={22}
                            color="#25D366"
                          />
                        </Pressable>
                      </View>
                    </View>
                  </Card>
                </Swipeable>
              ))}
            </ScrollView>
          )}
          <CustomerSortBottomSheet
            ref={customerSortBottomSheetRef}
            draftSort={draftSort}
            setDraftSort={setDraftSort}
            onApply={(sort) => {
              setSortBy(sort);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
