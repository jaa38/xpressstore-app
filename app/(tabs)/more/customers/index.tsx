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

import { customers } from "@/data/customers";

import type { CustomerSort } from "@/types/customer-sort";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { CustomerSortBottomSheet } from "@/components/bottom-sheet/CustomerSortBottomSheet";

export default function CustomersScreen() {
  const phoneNumber = "+23493322201234";

  async function handleCall() {
    const url = `tel:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to place call");
    }
  }

  async function handleWhatsApp() {
    const url = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp is not installed.");
    }
  }

  const customerSortBottomSheetRef = useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // TODO: Fetch customers here
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
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
        return data.sort(
          (a, b) =>
            Number(b.spent.replace(/[₦,]/g, "")) -
            Number(a.spent.replace(/[₦,]/g, ""))
        );

      case "lowestSpent":
        return data.sort(
          (a, b) =>
            Number(a.spent.replace(/[₦,]/g, "")) -
            Number(b.spent.replace(/[₦,]/g, ""))
        );

      case "mostOrders":
        return data.sort((a, b) => b.orders - a.orders);

      case "leastOrders":
        return data.sort((a, b) => a.orders - b.orders);

      default:
        return data;
    }
  }, [sortBy]);
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
                Number of customers
              </AppText>
            </View>

            {/* Add Button */}

            <Pressable
              onPress={() => {
                // router.push(ROUTES.ADD_CUSTOMER)
              }}
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
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.action.primary.background}
                colors={[theme.action.primary.background]}
              />
            }
          >
            {sortedCustomers.map((customer) => (
              <Card key={customer.id}>
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

                      <AppText variant="bodyBold">{customer.orders}</AppText>
                    </View>

                    <View>
                      <AppText variant="label" color="secondary">
                        Spent
                      </AppText>

                      <AppText variant="bodyBold">{customer.spent}</AppText>
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
                      onPress={handleCall}
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
                      onPress={handleWhatsApp}
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
            ))}
          </ScrollView>

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
