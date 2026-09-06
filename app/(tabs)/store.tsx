import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Share,
  ToastAndroid,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import * as Clipboard from "expo-clipboard";

import { ROUTES, getStoreDetailsRoute } from "@/navigation/routes";

import { AppText } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { Card } from "@/components/ui/Card";

import { SearchBar } from "@/components/ui/SearchBar";

import { FilterButton } from "@/components/ui/FilterButton";

import { Divider } from "@/components/ui/Divider";

import {
  StoreFrontBottomSheet,
  StoreFilter,
} from "@/components/bottom-sheet/StoreFrontBottomSheet";

import { spacing, theme, radius } from "@/theme";

import { useStores } from "@/hooks/store/useStores";

import { useDeleteStore } from "@/hooks/store/useDeleteStore";

import { useToast } from "@/hooks/useToast";

/**
 * ============================================================================
 * RIGHT SWIPE ACTIONS
 * ============================================================================
 */

function RightActions({
  onDelete,
  disabled,
}: {
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Delete store"
      disabled={disabled}
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.action.primary.delete,
        borderRadius: radius.md,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name="trash-outline" size={24} color={theme.text.inverse} />

      <AppText
        variant="bodySmall"
        color="inverse"
        style={{
          marginTop: spacing.xs,
        }}
      >
        Delete
      </AppText>
    </Pressable>
  );
}

/**
 * ============================================================================
 * STORE CARD
 * ============================================================================
 */

function StoreCard({
  store,
  deleting,
  onDelete,
  onCopyLink,
  onShareLink,
  onViewDetails,
}: {
  store: {
    storeId: number;
    storeName: string;
    storeLink: string;
    isActive: boolean;
  };
  deleting: boolean;
  onDelete: (storeId: number) => void;
  onCopyLink: (storeLink: string) => void;
  onShareLink: (storeLink: string) => void;
  onViewDetails: (storeId: number) => void;
}) {
  return (
    <Swipeable
      enabled={!deleting}
      renderRightActions={() => (
        <RightActions
          disabled={deleting}
          onDelete={() => onDelete(store.storeId)}
        />
      )}
    >
      <Card>
        {/* ================================================================
            STORE HEADER
        ================================================================= */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {/* STORE IMAGE */}

          <Image
            source={require("../../assets/images/default-storefront.png.png")}
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.sm,
            }}
            resizeMode="cover"
          />

          {/* STORE DETAILS */}

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            {/* STORE NAME */}

            <AppText variant="bodyBold" color="primary" numberOfLines={1}>
              {store.storeName}
            </AppText>

            {/* STORE LINK */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Copy ${store.storeName} link`}
              disabled={deleting}
              onPress={() => onCopyLink(store.storeLink)}
              style={({ pressed }) => ({
                opacity: pressed || deleting ? 0.6 : 1,
              })}
            >
              <AppText variant="bodySmall" color="link" numberOfLines={1}>
                {store.storeLink}
              </AppText>
            </Pressable>

            {/* STATUS */}

            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: radius.full,
                backgroundColor: store.isActive
                  ? theme.badge.success.background
                  : theme.badge.error.background,
              }}
            >
              <AppText
                variant="bodySmall"
                color={store.isActive ? "success" : "error"}
              >
                {store.isActive ? "Active" : "Inactive"}
              </AppText>
            </View>
          </View>

          {/* SHARE */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Share ${store.storeName}`}
            disabled={deleting}
            hitSlop={10}
            onPress={() => onShareLink(store.storeLink)}
            style={({ pressed }) => ({
              opacity: pressed || deleting ? 0.6 : 1,
            })}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={theme.icon.default.icon}
            />
          </Pressable>
        </View>

        {/* ================================================================
            DIVIDER
        ================================================================= */}

        <Divider
          style={{
            marginVertical: spacing.md,
          }}
        />

        {/* ================================================================
            STORE INFO
        ================================================================= */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${store.storeName} information`}
          disabled={deleting}
          onPress={() => onViewDetails(store.storeId)}
          style={({ pressed }) => ({
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: pressed || deleting ? 0.6 : 1,
          })}
        >
          <AppText variant="bodySmall" color="muted">
            Store Info
          </AppText>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.icon.default.icon}
          />
        </Pressable>
      </Card>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * STORE SCREEN
 * ============================================================================
 */

export default function StoreScreen() {
  /**
   * --------------------------------------------------------------------------
   * STORES
   * --------------------------------------------------------------------------
   */

  const {
    stores: apiStores,
    isLoading: apiIsLoading,
    isRefetching: apiIsRefetching,
    error: apiError,
    refetch,
  } = useStores();

  /**
   * --------------------------------------------------------------------------
   * DATA SOURCE
   * --------------------------------------------------------------------------
   */

  const stores = apiStores ?? [];

  const isLoading = apiIsLoading;

  const isRefetching = apiIsRefetching;

  const error = apiError;

  /**
   * --------------------------------------------------------------------------
   * DELETE MUTATION
   * --------------------------------------------------------------------------
   */

  const deleteStoreMutation = useDeleteStore();

  /**
   * --------------------------------------------------------------------------
   * TOAST
   * --------------------------------------------------------------------------
   */

  const { showToast } = useToast();

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * --------------------------------------------------------------------------
   * FILTER
   * --------------------------------------------------------------------------
   */

  const [selectedFilter, setSelectedFilter] = useState<StoreFilter>("all");

  /**
   * --------------------------------------------------------------------------
   * INFINITE SCROLL
   * --------------------------------------------------------------------------
   */

  const STORES_PER_BATCH = 10;

  const [visibleStoreCount, setVisibleStoreCount] = useState(STORES_PER_BATCH);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * BOTTOM SHEET
   * --------------------------------------------------------------------------
   */

  const storeFrontBottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * --------------------------------------------------------------------------
   * SUMMARY
   * --------------------------------------------------------------------------
   */

  const totalStores = stores.length;

  const activeStores = stores.filter((store) => store.isActive).length;

  const inactiveStores = stores.filter((store) => !store.isActive).length;

  /**
   * --------------------------------------------------------------------------
   * SORT STORES
   * --------------------------------------------------------------------------
   */

  const sortedStores = useMemo(() => {
    return [...stores].sort((a, b) => a.storeName.localeCompare(b.storeName));
  }, [stores]);

  /**
   * --------------------------------------------------------------------------
   * SEARCH + FILTER
   * --------------------------------------------------------------------------
   */

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedStores.filter((store) => {
      const matchesSearch =
        !query ||
        store.storeName.toLowerCase().includes(query) ||
        store.storeLink.toLowerCase().includes(query);

      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "active" && store.isActive) ||
        (selectedFilter === "inactive" && !store.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [sortedStores, searchQuery, selectedFilter]);

  /**
   * --------------------------------------------------------------------------
   * RESET INFINITE SCROLL WHEN SEARCH OR FILTER CHANGES
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    setVisibleStoreCount(STORES_PER_BATCH);
  }, [searchQuery, selectedFilter]);

  /**
   * --------------------------------------------------------------------------
   * KEEP VISIBLE COUNT VALID
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    setVisibleStoreCount((currentCount) =>
      Math.min(currentCount, Math.max(STORES_PER_BATCH, filteredStores.length))
    );
  }, [filteredStores.length]);

  /**
   * --------------------------------------------------------------------------
   * DISPLAYED STORES
   * --------------------------------------------------------------------------
   */

  const displayedStores = useMemo(() => {
    return filteredStores.slice(0, visibleStoreCount);
  }, [filteredStores, visibleStoreCount]);

  /**
   * --------------------------------------------------------------------------
   * HAS MORE STORES
   * --------------------------------------------------------------------------
   */

  const hasMoreStores = displayedStores.length < filteredStores.length;

  /**
   * --------------------------------------------------------------------------
   * LOAD MORE STORES
   * --------------------------------------------------------------------------
   */

  const loadMoreStores = useCallback(() => {
    if (isLoadingMore || !hasMoreStores) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleStoreCount((currentCount) =>
        Math.min(currentCount + STORES_PER_BATCH, filteredStores.length)
      );

      setIsLoadingMore(false);
    }, 150);
  }, [isLoadingMore, hasMoreStores, filteredStores.length]);

  /**
   * --------------------------------------------------------------------------
   * COPY STORE LINK
   * --------------------------------------------------------------------------
   */

  async function handleCopyLink(storeLink: string) {
    await Clipboard.setStringAsync(storeLink);

    if (Platform.OS === "android") {
      ToastAndroid.show("Link copied", ToastAndroid.SHORT);
    } else {
      Alert.alert(
        "Link copied",
        "The store link has been copied to your clipboard."
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * SHARE STORE LINK
   * --------------------------------------------------------------------------
   */

  async function handleShareLink(storeLink: string) {
    if (!storeLink) {
      return;
    }

    try {
      await Share.share({
        message: storeLink,
      });
    } catch (error) {
      console.log("Error sharing store link:", error);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  async function onRefresh() {
    await refetch();

    setVisibleStoreCount(STORES_PER_BATCH);
  }

  /**
   * --------------------------------------------------------------------------
   * DELETE STORE
   * --------------------------------------------------------------------------
   */

  function handleDelete(storeId: number) {
    if (deleteStoreMutation.isPending) {
      return;
    }

    const store = stores.find((item) => item.storeId === storeId);

    if (!store) {
      return;
    }

    Alert.alert(
      "Delete Store",
      `Are you sure you want to delete "${store.storeName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteStoreMutation.mutateAsync(storeId);

              setVisibleStoreCount(STORES_PER_BATCH);

              showToast({
                type: "success",
                title: "Store Deleted",
                message: `${store.storeName} has been deleted successfully.`,
              });
            } catch (error) {
              console.log("DELETE STORE ERROR", error);

              showToast({
                type: "error",
                title: "Delete Failed",
                message: "Unable to delete this store. Please try again.",
              });
            }
          },
        },
      ]
    );
  }

  /**
   * --------------------------------------------------------------------------
   * VIEW STORE DETAILS
   * --------------------------------------------------------------------------
   */

  function handleViewDetails(storeId: number) {
    router.push(getStoreDetailsRoute(storeId));
  }

  /**
   * --------------------------------------------------------------------------
   * FILTER LABEL
   * --------------------------------------------------------------------------
   */

  const filterLabel =
    selectedFilter === "active"
      ? "Active"
      : selectedFilter === "inactive"
        ? "Inactive"
        : "All Stores";

  /**
   * --------------------------------------------------------------------------
   * SCREEN STATES
   * --------------------------------------------------------------------------
   *
   * State priority:
   *
   * 1. Initial loading
   * 2. First-time user
   * 3. Existing stores + API error
   * 4. Existing stores + no search/filter results
   * 5. Store list
   *
   * A brand-new merchant should see an onboarding state rather than a
   * technical error or empty filtering UI.
   */

  const hasStores = stores.length > 0;

  const isFirstTimeUser =
    !isLoading &&
    !hasStores &&
    searchQuery.trim() === "" &&
    selectedFilter === "all";

  const showStoreError = !isLoading && !!error && hasStores;

  const hasNoSearchResults =
    !isLoading && !showStoreError && hasStores && filteredStores.length === 0;

  /**
   * --------------------------------------------------------------------------
   * HEADER SUBTITLE
   * --------------------------------------------------------------------------
   */

  const headerSubtitle = isLoading
    ? "Loading storefronts..."
    : isFirstTimeUser
      ? "Create your first storefront"
      : totalStores === 1
        ? "1 storefront"
        : `${totalStores} storefronts`;

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
          ================================================================= */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Storefront</AppText>

              <AppText variant="bodySmall" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>

            {/* ============================================================
                ADD STORE
                Hidden for first-time users.
            ============================================================= */}

            {!isFirstTimeUser && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create Store"
                disabled={deleteStoreMutation.isPending}
                onPress={() => router.push(ROUTES.ADD_STORE_INFORMATION)}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: pressed
                    ? theme.action.primary.pressed
                    : theme.action.primary.background,
                  opacity: deleteStoreMutation.isPending ? 0.5 : 1,
                })}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={theme.action.primary.text}
                />
              </Pressable>
            )}
          </View>

          {/* ================================================================
              SUMMARY
              Hidden for first-time users.
          ================================================================= */}

          {!isFirstTimeUser && (
            <Card
              style={{
                marginTop: spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* TOTAL */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Total Stores
                  </AppText>

                  <AppText variant="h2" color="strong">
                    {isLoading ? "—" : totalStores}
                  </AppText>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,
                    height: 40,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* ACTIVE */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Active
                  </AppText>

                  <AppText variant="h2" color="success">
                    {isLoading ? "—" : activeStores}
                  </AppText>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,
                    height: 40,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* INACTIVE */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Inactive
                  </AppText>

                  <AppText variant="h2" color="error">
                    {isLoading ? "—" : inactiveStores}
                  </AppText>
                </View>
              </View>
            </Card>
          )}

          {/* ================================================================
              SEARCH + FILTER
              Hidden for first-time users.
          ================================================================= */}

          {!isFirstTimeUser && !showStoreError && (
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
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search stores"
                />
              </View>

              <FilterButton
                active={selectedFilter !== "all"}
                onPress={() => storeFrontBottomSheetRef.current?.present()}
              />
            </View>
          )}

          {/* ================================================================
              FILTER LABEL
          ================================================================= */}

          {selectedFilter !== "all" && !isFirstTimeUser && !showStoreError && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: spacing.sm,
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
                  Filter:
                </AppText>

                <AppText variant="bodySmallBold" color="brand">
                  {filterLabel}
                </AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear store filter"
                hitSlop={8}
                onPress={() => setSelectedFilter("all")}
              >
                <AppText variant="bodySmall" color="link">
                  Clear
                </AppText>
              </Pressable>
            </View>
          )}

          {/* ================================================================
              STORE CONTENT
          ================================================================= */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {/* ============================================================
                INITIAL LOADING
            ============================================================= */}

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
                  Loading storefronts...
                </AppText>
              </View>
            ) : isFirstTimeUser ? (
              /* ==========================================================
                 FIRST-TIME USER
              =========================================================== */

              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <Image
                  source={require("../../assets/images/default-storefront.png.png")}
                  style={{
                    width: 128,
                    height: 128,
                  }}
                  resizeMode="contain"
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  No stores yet
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
                  Create your first storefront to start selling your products
                  online.
                </AppText>

                <Button
                  title="Create Store"
                  variant="primary"
                  style={{
                    marginTop: spacing.lg,
                  }}
                  onPress={() => router.push(ROUTES.ADD_STORE_INFORMATION)}
                />

                <AppText
                  variant="caption"
                  color="muted"
                  style={{
                    marginTop: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  You can manage your storefront and products from here.
                </AppText>
              </Card>
            ) : showStoreError ? (
              /* ==========================================================
                 EXISTING STORES + ERROR
              =========================================================== */

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
                  Unable to load stores
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
                  We couldn't load your storefronts. Please try again.
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
            ) : hasNoSearchResults ? (
              /* ==========================================================
                 SEARCH / FILTER EMPTY STATE
              =========================================================== */

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
                  No stores found
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
                  Try searching with a different store name or change your
                  filter.
                </AppText>

                {searchQuery.trim() !== "" && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear store search"
                    onPress={() => setSearchQuery("")}
                    style={{
                      marginTop: spacing.md,
                    }}
                  >
                    <AppText color="link">Clear Search</AppText>
                  </Pressable>
                )}

                {selectedFilter !== "all" && searchQuery.trim() === "" && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear store filter"
                    onPress={() => setSelectedFilter("all")}
                    style={{
                      marginTop: spacing.md,
                    }}
                  >
                    <AppText color="link">Clear Filter</AppText>
                  </Pressable>
                )}
              </Card>
            ) : (
              /* ==========================================================
                 STORE LIST
              =========================================================== */

              <FlatList
                data={displayedStores}
                keyExtractor={(item) => item.storeId.toString()}
                renderItem={({ item }) => (
                  <StoreCard
                    store={item}
                    deleting={deleteStoreMutation.isPending}
                    onDelete={handleDelete}
                    onCopyLink={handleCopyLink}
                    onShareLink={handleShareLink}
                    onViewDetails={handleViewDetails}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: spacing.md,
                    }}
                  />
                )}
                contentContainerStyle={{
                  paddingBottom: spacing["2xl"],
                }}
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
                onEndReached={loadMoreStores}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  hasMoreStores || isLoadingMore ? (
                    <View
                      style={{
                        paddingVertical: spacing.lg,
                        alignItems: "center",
                      }}
                    >
                      {isLoadingMore && (
                        <>
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
                            Loading more stores...
                          </AppText>
                        </>
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingVertical: spacing.lg,
                        alignItems: "center",
                      }}
                    >
                      <AppText variant="caption" color="muted">
                        You've reached the end of your stores.
                      </AppText>
                    </View>
                  )
                }
              />
            )}
          </View>
        </View>
      </View>

      {/* ======================================================================
          STORE FILTER BOTTOM SHEET
      ======================================================================= */}

      <StoreFrontBottomSheet
        ref={storeFrontBottomSheetRef}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </SafeAreaView>
  );
}
