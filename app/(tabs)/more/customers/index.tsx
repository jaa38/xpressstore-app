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

import { useBlacklistCustomer } from "@/hooks/customers/useBlacklistCustomer";

function RightActions({
  onBlacklist,
  onDelete,
  isBlacklisted,
  disabled,
}: {
  onBlacklist: () => void;
  onDelete: () => void;
  isBlacklisted: boolean;
  disabled: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.sm,
      }}
    >
      <Pressable
        disabled={disabled}
        onPress={onBlacklist}
        style={{
          width: 90,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isBlacklisted
            ? theme.action.primary.background
            : theme.action.destructive.background,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Ionicons
          name={isBlacklisted ? "checkmark-circle-outline" : "ban-outline"}
          size={24}
          color={
            isBlacklisted
              ? theme.action.primary.text
              : theme.action.destructive.text
          }
        />

        <AppText color="inverse">
          {isBlacklisted ? "Unblock" : "Blacklist"}
        </AppText>
      </Pressable>

      <Pressable
        disabled={disabled}
        onPress={onDelete}
        style={{
          width: 90,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.action.destructive.background,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={theme.action.destructive.text}
        />

        <AppText color="inverse">Delete</AppText>
      </Pressable>
    </View>
  );
}

export default function CustomersScreen() {
  const {
    data: customers = [],
    isLoading,
    isRefetching,
    refetch,
  } = useCustomers();

  const deleteCustomerMutation = useDeleteCustomer();
  const blacklistCustomerMutation = useBlacklistCustomer();

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

  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const sortedCustomers = useMemo(() => {
    const data = [...filteredCustomers];

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
  }, [filteredCustomers, sortBy]);

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

  function handleBlacklist(customer: Customer) {
    const isBlacklisted = customer.isBlackListed;

    Alert.alert(
      isBlacklisted ? "Remove from Blacklist" : "Blacklist Customer",
      isBlacklisted
        ? `Are you sure you want to remove "${customer.name}" from the blacklist?`
        : `Are you sure you want to blacklist "${customer.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: isBlacklisted ? "Remove" : "Blacklist",
          style: isBlacklisted ? "default" : "destructive",
          onPress: () => {
            blacklistCustomerMutation.mutate(
              {
                id: customer.id,
                isBlackListed: !isBlacklisted,
              },
              {
                onSuccess: () => {
                  Alert.alert(
                    isBlacklisted
                      ? "Customer Removed from Blacklist"
                      : "Customer Blacklisted",
                    isBlacklisted
                      ? `"${customer.name}" has been removed from the blacklist.`
                      : `"${customer.name}" has been blacklisted.`
                  );
                },

                onError: (error) => {
                  Alert.alert(
                    isBlacklisted
                      ? "Unable to Remove from Blacklist"
                      : "Blacklist Failed",
                    error instanceof Error
                      ? error.message
                      : "Unable to update blacklist status."
                  );
                },
              }
            );
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
                {filteredCustomers.length} customer
                {filteredCustomers.length !== 1 ? "s" : ""}
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
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name, phone or email"
              />
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
                {search.trim() ? "No customers found" : "No customers yet"}
              </AppText>

              <AppText
                variant="body"
                color="secondary"
                style={{
                  textAlign: "center",
                  marginTop: spacing.xs,
                  paddingHorizontal: spacing.lg,
                }}
              >
                {search.trim()
                  ? "Try searching with a different name, phone number or email."
                  : "Tap the + button to create your first customer."}
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
                      isBlacklisted={customer.isBlackListed}
                      disabled={
                        deleteCustomerMutation.isPending ||
                        blacklistCustomerMutation.isPending
                      }
                      onBlacklist={() => {
                        if (
                          !deleteCustomerMutation.isPending &&
                          !blacklistCustomerMutation.isPending
                        ) {
                          handleBlacklist(customer);
                        }
                      }}
                      onDelete={() => {
                        if (
                          !deleteCustomerMutation.isPending &&
                          !blacklistCustomerMutation.isPending
                        ) {
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

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.sm,
                          }}
                        >
                          <AppText variant="h3">{customer.name}</AppText>

                          {customer.isBlackListed && (
                            <View
                              style={{
                                paddingHorizontal: spacing.sm,
                                paddingVertical: spacing.xs,
                                borderRadius: radius.full,
                                backgroundColor: theme.state.error.background,
                              }}
                            >
                              <AppText variant="caption" color="error">
                                Blacklisted
                              </AppText>
                            </View>
                          )}
                        </View>

                        <AppText variant="body" color="secondary">
                          {customer.phone}
                        </AppText>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.xs,
                        }}
                      >
                        <Pressable
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: radius.full,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            router.push({
                              pathname: "/customers/view/[id]",
                              params: {
                                id: customer.id,
                              },
                            })
                          }
                        >
                          <Ionicons
                            name="eye-outline"
                            size={20}
                            color={theme.state.info.icon}
                          />
                        </Pressable>

                        <Pressable
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: radius.full,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            router.push({
                              pathname: "/customers/[id]",
                              params: {
                                id: customer.id,
                              },
                            })
                          }
                        >
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color={theme.icon.default.icon}
                          />
                        </Pressable>
                      </View>
                    </View>

                    <Divider
                      style={{
                        marginVertical: spacing.rg,
                      }}
                    />

                    {/* Customer Actions */}

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
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
