import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { FilterButton } from "@/components/ui/FilterButton";

import { CustomerSortBottomSheet } from "@/components/bottom-sheet/CustomerSortBottomSheet";

import { spacing, theme, radius } from "@/theme";

import { useCustomers } from "@/hooks/customers/useCustomers";
import { useDeleteCustomer } from "@/hooks/customers/useDeleteCustomer";
import { useBlacklistCustomer } from "@/hooks/customers/useBlacklistCustomer";

import { ROUTES } from "@/navigation/routes";

import type { Customer } from "@/types/customer";
import type { CustomerSort } from "@/types/customer-sort";

/**
 * ============================================================================
 * INFINITE SCROLL CONFIGURATION
 * ============================================================================
 */

const CUSTOMERS_PER_BATCH = 10;

/**
 * ============================================================================
 * RIGHT SWIPE ACTIONS
 * ============================================================================
 */

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
      {/* BLACKLIST / UNBLOCK */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isBlacklisted
            ? "Remove customer from blacklist"
            : "Blacklist customer"
        }
        disabled={disabled}
        onPress={onBlacklist}
        style={{
          width: 90,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isBlacklisted
            ? theme.action.primary.background
            : theme.action.blacklist.background,
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
              : theme.action.blacklist.text
          }
        />

        <AppText color="inverse">
          {isBlacklisted ? "Unblock" : "Blacklist"}
        </AppText>
      </Pressable>

      {/* DELETE */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete customer"
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

/**
 * ============================================================================
 * CUSTOMER CARD
 * ============================================================================
 */

function CustomerCard({
  customer,
  mutationPending,
  onBlacklist,
  onDelete,
  onCall,
  onWhatsApp,
  onView,
  onEdit,
}: {
  customer: Customer;
  mutationPending: boolean;
  onBlacklist: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onCall: (phone: string) => void;
  onWhatsApp: (phone: string) => void;
  onView: (customerId: string) => void;
  onEdit: (customerId: string) => void;
}) {
  return (
    <Swipeable
      enabled={!mutationPending}
      renderRightActions={() => (
        <RightActions
          isBlacklisted={customer.isBlackListed}
          disabled={mutationPending}
          onBlacklist={() => onBlacklist(customer)}
          onDelete={() => onDelete(customer)}
        />
      )}
    >
      <Card>
        {/* ================================================================
            CUSTOMER HEADER
        ================================================================ */}

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
              <AppText
                variant="h3"
                numberOfLines={1}
                style={{
                  flexShrink: 1,
                }}
              >
                {customer.name}
              </AppText>

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
            {/* VIEW */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View ${customer.name}`}
              disabled={mutationPending}
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                opacity: mutationPending ? 0.5 : 1,
              }}
              onPress={() => onView(customer.id)}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={theme.state.info.icon}
              />
            </Pressable>

            {/* EDIT */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${customer.name}`}
              disabled={mutationPending}
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                opacity: mutationPending ? 0.5 : 1,
              }}
              onPress={() => onEdit(customer.id)}
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: spacing.sm,
          }}
        >
          {/* CALL */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${customer.name}`}
            disabled={mutationPending}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.full,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.background.subtle,
              opacity: mutationPending ? 0.5 : 1,
            }}
            onPress={() => onCall(customer.phone)}
          >
            <Ionicons
              name="call-outline"
              size={22}
              color={theme.icon.default.icon}
            />
          </Pressable>

          {/* WHATSAPP */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`WhatsApp ${customer.name}`}
            disabled={mutationPending}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.full,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#25D36615",
              opacity: mutationPending ? 0.5 : 1,
            }}
            onPress={() => onWhatsApp(customer.phone)}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          </Pressable>
        </View>
      </Card>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * SCREEN
 * ============================================================================
 */

export default function CustomersScreen() {
  /**
   * --------------------------------------------------------------------------
   * CUSTOMER DATA
   * --------------------------------------------------------------------------
   *
   * The screen does not know whether the data comes from the API or mocks.
   * That decision belongs inside the customer service.
   */

  const {
    data: customers = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useCustomers();

  /**
   * --------------------------------------------------------------------------
   * MUTATIONS
   * --------------------------------------------------------------------------
   */

  const deleteCustomerMutation = useDeleteCustomer();

  const blacklistCustomerMutation = useBlacklistCustomer();

  /**
   * --------------------------------------------------------------------------
   * SORT
   * --------------------------------------------------------------------------
   */

  const [sortBy, setSortBy] = useState<CustomerSort>("firstNameAsc");

  const [draftSort, setDraftSort] = useState<CustomerSort>("firstNameAsc");

  const customerSortBottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [search, setSearch] = useState("");

  /**
   * --------------------------------------------------------------------------
   * INFINITE SCROLL
   * --------------------------------------------------------------------------
   */

  const [visibleCustomerCount, setVisibleCustomerCount] =
    useState(CUSTOMERS_PER_BATCH);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    setVisibleCustomerCount(CUSTOMERS_PER_BATCH);

    await refetch();
  };

  /**
   * --------------------------------------------------------------------------
   * SEARCH FILTER
   * --------------------------------------------------------------------------
   */

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

  /**
   * --------------------------------------------------------------------------
   * SORT
   * --------------------------------------------------------------------------
   */

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

  /**
   * --------------------------------------------------------------------------
   * RESET PAGINATION
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    setVisibleCustomerCount(CUSTOMERS_PER_BATCH);
  }, [search, sortBy]);

  /**
   * --------------------------------------------------------------------------
   * DISPLAYED CUSTOMERS
   * --------------------------------------------------------------------------
   */

  const displayedCustomers = useMemo(() => {
    return sortedCustomers.slice(0, visibleCustomerCount);
  }, [sortedCustomers, visibleCustomerCount]);

  /**
   * --------------------------------------------------------------------------
   * HAS MORE CUSTOMERS
   * --------------------------------------------------------------------------
   */

  const hasMoreCustomers = displayedCustomers.length < sortedCustomers.length;

  /**
   * --------------------------------------------------------------------------
   * LOAD MORE CUSTOMERS
   * --------------------------------------------------------------------------
   *
   * The current customer hook returns the complete collection.
   *
   * We therefore preserve the existing UI behaviour by progressively
   * revealing customers locally.
   */

  const loadMoreCustomers = useCallback(() => {
    if (isLoadingMore || !hasMoreCustomers) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCustomerCount((currentCount) =>
        Math.min(currentCount + CUSTOMERS_PER_BATCH, sortedCustomers.length)
      );

      setIsLoadingMore(false);
    }, 150);
  }, [isLoadingMore, hasMoreCustomers, sortedCustomers.length]);

  /**
   * --------------------------------------------------------------------------
   * CUSTOMER STATES
   * --------------------------------------------------------------------------
   */

  const hasCustomers = customers.length > 0;

  const isFirstTimeUser = !isLoading && !hasCustomers && search.trim() === "";

  const showCustomerError = !isLoading && !!error && hasCustomers;

  const hasNoSearchResults =
    !isLoading &&
    !error &&
    hasCustomers &&
    search.trim() !== "" &&
    filteredCustomers.length === 0;

  /**
   * --------------------------------------------------------------------------
   * CALL
   * --------------------------------------------------------------------------
   */

  async function handleCall(phone: string) {
    const url = `tel:${phone}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to place call");
    }
  }

  /**
   * --------------------------------------------------------------------------
   * WHATSAPP
   * --------------------------------------------------------------------------
   */

  async function handleWhatsApp(phone: string) {
    const cleanedPhone = phone.replace(/\D/g, "");

    const url = `https://wa.me/${cleanedPhone}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp is not installed.");
    }
  }

  /**
   * --------------------------------------------------------------------------
   * DELETE
   * --------------------------------------------------------------------------
   */

  function handleDelete(customer: Customer) {
    if (deleteCustomerMutation.isPending) {
      return;
    }

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

              onError: (mutationError) => {
                Alert.alert(
                  "Delete Failed",
                  mutationError instanceof Error
                    ? mutationError.message
                    : "Unable to delete customer."
                );
              },
            });
          },
        },
      ]
    );
  }

  /**
   * --------------------------------------------------------------------------
   * BLACKLIST
   * --------------------------------------------------------------------------
   */

  function handleBlacklist(customer: Customer) {
    if (blacklistCustomerMutation.isPending) {
      return;
    }

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

                onError: (mutationError) => {
                  Alert.alert(
                    isBlacklisted
                      ? "Unable to Remove from Blacklist"
                      : "Blacklist Failed",

                    mutationError instanceof Error
                      ? mutationError.message
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

  /**
   * --------------------------------------------------------------------------
   * VIEW CUSTOMER
   * --------------------------------------------------------------------------
   */

  function handleView(customerId: string) {
    router.push({
      pathname: "/customers/view/[id]",
      params: {
        id: customerId,
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * EDIT CUSTOMER
   * --------------------------------------------------------------------------
   */

  function handleEdit(customerId: string) {
    router.push({
      pathname: "/customers/[id]",
      params: {
        id: customerId,
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * MUTATION STATE
   * --------------------------------------------------------------------------
   */

  const mutationPending =
    deleteCustomerMutation.isPending || blacklistCustomerMutation.isPending;

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
   */

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
          }}
        >
          {/* ================================================================
              HEADER
          ================================================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
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
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Customers</AppText>

              <AppText variant="body" color="secondary">
                {isLoading
                  ? "Loading customers..."
                  : filteredCustomers.length === 0
                    ? "Add your first customer to start building your customer list"
                    : filteredCustomers.length === 1
                      ? "1 customer"
                      : `${filteredCustomers.length} customers`}
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add customer"
              disabled={mutationPending}
              onPress={() => router.push(ROUTES.ADD_CUSTOMER)}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: pressed
                  ? theme.action.primary.pressed
                  : theme.action.primary.background,
                opacity: mutationPending ? 0.5 : 1,
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ================================================================
              SEARCH + FILTER
          ================================================================ */}

          <View
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
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

          {/* ================================================================
              CUSTOMER CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: spacing["3xl"],
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={theme.icon.branding.icon}
                />

                <AppText
                  color="secondary"
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  Loading customers...
                </AppText>
              </View>
            ) : showCustomerError ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: spacing["3xl"],
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.background.error,
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={30}
                    color={theme.icon.error.icon}
                  />
                </View>

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  Unable to load customers
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                    maxWidth: 320,
                  }}
                >
                  We couldn't load your customers. Please try again.
                </AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try again"
                  onPress={() => refetch()}
                  style={{
                    marginTop: spacing.md,
                    paddingVertical: spacing.xs,
                    paddingHorizontal: spacing.sm,
                  }}
                >
                  <AppText color="link">Try Again</AppText>
                </Pressable>
              </View>
            ) : isFirstTimeUser ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.icon.branding.background,
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={32}
                    color={theme.icon.branding.icon}
                  />
                </View>

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  No customers yet
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                    maxWidth: 320,
                  }}
                >
                  Add your first customer to start managing customer information
                  and orders.
                </AppText>

                <Button
                  title="Add Customer"
                  variant="primary"
                  style={{
                    marginTop: spacing.lg,
                  }}
                  onPress={() => router.push(ROUTES.ADD_CUSTOMER)}
                />

                <AppText
                  variant="caption"
                  color="muted"
                  style={{
                    marginTop: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  You can update customer details and contact them anytime.
                </AppText>
              </Card>
            ) : hasNoSearchResults ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={28}
                    color={theme.icon.default.icon}
                  />
                </View>

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  No customers found
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  Try searching with a different name, phone number or email.
                </AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setSearch("")}
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  <AppText color="link">Clear Search</AppText>
                </Pressable>
              </Card>
            ) : (
              <FlatList
                style={{
                  flex: 1,
                }}
                data={displayedCustomers}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <CustomerCard
                    customer={item}
                    mutationPending={mutationPending}
                    onBlacklist={handleBlacklist}
                    onDelete={handleDelete}
                    onCall={handleCall}
                    onWhatsApp={handleWhatsApp}
                    onView={handleView}
                    onEdit={handleEdit}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: spacing.md,
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={onRefresh}
                    tintColor={theme.icon.branding.icon}
                    colors={[theme.icon.branding.icon]}
                    progressBackgroundColor={theme.background.surface}
                  />
                }
                contentContainerStyle={{
                  paddingTop: spacing.md,
                  paddingBottom: spacing["2xl"],
                }}
                onEndReached={loadMoreCustomers}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  <>
                    {isLoadingMore && (
                      <View
                        style={{
                          paddingVertical: spacing.lg,
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator
                          size="small"
                          color={theme.icon.branding.icon}
                        />

                        <AppText
                          variant="caption"
                          color="secondary"
                          style={{
                            marginTop: spacing.xs,
                          }}
                        >
                          Loading more customers...
                        </AppText>
                      </View>
                    )}

                    {!isLoadingMore &&
                      !hasMoreCustomers &&
                      displayedCustomers.length > 0 && (
                        <View
                          style={{
                            paddingVertical: spacing.lg,
                            alignItems: "center",
                          }}
                        >
                          <AppText variant="caption" color="muted">
                            You've reached the end of your customers.
                          </AppText>
                        </View>
                      )}
                  </>
                }
              />
            )}
          </View>

          {/* ================================================================
              SORT BOTTOM SHEET
          ================================================================ */}

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
