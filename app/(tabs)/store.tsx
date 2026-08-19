import {
  Pressable,
  View,
  Image,
  Platform,
  ToastAndroid,
  Alert,
  Share,
  ScrollView,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { ROUTES, getStoreDetailsRoute } from "@/navigation/routes";
import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterButton } from "@/components/ui/FilterButton";
import { Divider } from "@/components/ui/Divider";

import {
  StoreFrontBottomSheet,
  StoreFilter,
} from "@/components/bottom-sheet/StoreFrontBottomSheet";

import { spacing, theme, radius } from "@/theme";

import { useRef, useState } from "react";

import * as Clipboard from "expo-clipboard";

interface Store {
  storeId: number;
  storeName: string;
  storeLink: string;
  isActive: boolean;
}

const stores: Store[] = [
  {
    storeId: 1,
    storeName: "My Fashion Store",
    storeLink: "https://storelink.myxpresspay.com/store/my-fashion-store",
    isActive: true,
  },
  {
    storeId: 2,
    storeName: "Tech Store",
    storeLink: "https://storelink.myxpresspay.com/store/tech-store",
    isActive: false,
  },
  {
    storeId: 3,
    storeName: "Home Essentials",
    storeLink: "https://storelink.myxpresspay.com/store/home-essentials",
    isActive: true,
  },
];

export default function StoreScreen() {
  /*
   * --------------------------------------------------------------------------
   * SUMMARY
   * --------------------------------------------------------------------------
   */

  const totalStores = stores.length;

  const activeStores = stores.filter((store) => store.isActive).length;

  const inactiveStores = stores.filter((store) => !store.isActive).length;

  /*
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /*
   * --------------------------------------------------------------------------
   * FILTER
   * --------------------------------------------------------------------------
   */

  const [selectedFilter, setSelectedFilter] = useState<StoreFilter>("all");

  /*
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const [refreshing, setRefreshing] = useState(false);

  /*
   * --------------------------------------------------------------------------
   * BOTTOM SHEET
   * --------------------------------------------------------------------------
   */

  const storeFrontBottomSheetRef = useRef<BottomSheetModal>(null);

  /*
   * --------------------------------------------------------------------------
   * SORT STORES
   * --------------------------------------------------------------------------
   *
   * Always display stores alphabetically
   * by store name.
   */

  const sortedStores = [...stores].sort((a, b) =>
    a.storeName.localeCompare(b.storeName)
  );

  /*
   * --------------------------------------------------------------------------
   * SEARCH + FILTER
   * --------------------------------------------------------------------------
   */

  const filteredStores = sortedStores.filter((store) => {
    const query = searchQuery.trim().toLowerCase();

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

  /*
   * --------------------------------------------------------------------------
   * COPY STORE LINK
   * --------------------------------------------------------------------------
   */

  const handleCopyLink = async (storeLink: string) => {
    await Clipboard.setStringAsync(storeLink);

    if (Platform.OS === "android") {
      ToastAndroid.show("Link copied", ToastAndroid.SHORT);
    } else {
      Alert.alert(
        "Link copied",
        "The store link has been copied to your clipboard."
      );
    }
  };

  /*
   * --------------------------------------------------------------------------
   * SHARE STORE LINK
   * --------------------------------------------------------------------------
   */

  const handleShareLink = async (storeLink: string) => {
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
  };

  /*
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   *
   * Replace the timeout with your API refetch
   * when the stores API is connected.
   */

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  /*
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
          {/* ================================================================= */}
          {/* HEADER */}
          {/* ================================================================= */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* TITLE */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Storefront</AppText>

              <AppText variant="body" color="secondary">
                Create and manage your online storefronts
              </AppText>
            </View>

            {/* ADD STORE */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create Store"
              onPress={() => {
                router.push(ROUTES.ADD_STORE_INFORMATION);
              }}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.full,

                justifyContent: "center",
                alignItems: "center",

                backgroundColor: pressed
                  ? theme.action.primary.pressed
                  : theme.action.primary.background,
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ================================================================= */}
          {/* CONTENT */}
          {/* ================================================================= */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {/* ================================================================= */}
            {/* STORE SUMMARY */}
            {/* ================================================================= */}

            <Card>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  gap: spacing.lg,
                }}
              >
                {/* TOTAL */}

                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <AppText variant="bodySmall" color="primary">
                    Total Stores
                  </AppText>

                  <AppText variant="h3" color="strong">
                    {totalStores}
                  </AppText>
                </View>

                {/* ACTIVE */}

                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <AppText variant="bodySmall" color="primary">
                    Active Stores
                  </AppText>

                  <AppText variant="h3" color="success">
                    {activeStores}
                  </AppText>
                </View>

                {/* INACTIVE */}

                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <AppText variant="bodySmall" color="primary">
                    Inactive Stores
                  </AppText>

                  <AppText variant="h3" color="error">
                    {inactiveStores}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ================================================================= */}
            {/* SEARCH + FILTER */}
            {/* ================================================================= */}

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              {/* SEARCH */}

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

              {/* FILTER */}

              <FilterButton
                active={selectedFilter !== "all"}
                onPress={() => storeFrontBottomSheetRef.current?.present()}
              />
            </View>

            {/* ================================================================= */}
            {/* ACTIVE FILTER */}
            {/* ================================================================= */}

            {selectedFilter !== "all" && (
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

            {/* ================================================================= */}
            {/* STORE LIST */}
            {/* ================================================================= */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: spacing.lg,
                paddingBottom: spacing.xl,

                gap: spacing.md,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.icon.branding.icon}
                  colors={[theme.icon.branding.icon]}
                  progressBackgroundColor={theme.background.surface}
                />
              }
            >
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <Card
                    key={store.storeId}
                    style={{
                      padding: 12,
                    }}
                  >
                    {/* ===================================================== */}
                    {/* STORE CONTENT */}
                    {/* ===================================================== */}

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      {/* STORE IMAGE */}

                      <Image
                        source={require("../../assets/images/default-storefront.png.png")}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />

                      {/* STORE DETAILS */}

                      <View
                        style={{
                          flex: 1,
                          gap: 4,
                        }}
                      >
                        {/* STORE NAME */}

                        <AppText
                          variant="bodyBold"
                          color="primary"
                          numberOfLines={1}
                        >
                          {store.storeName}
                        </AppText>

                        {/* STORE LINK */}

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Copy ${store.storeName} link`}
                          onPress={() => handleCopyLink(store.storeLink)}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.6 : 1,
                          })}
                        >
                          <AppText
                            variant="bodySmall"
                            color="link"
                            numberOfLines={1}
                          >
                            {store.storeLink}
                          </AppText>
                        </Pressable>

                        {/* STATUS */}

                        <View
                          style={{
                            alignSelf: "flex-start",

                            paddingHorizontal: 8,

                            paddingVertical: 3,

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
                        hitSlop={10}
                        onPress={() => handleShareLink(store.storeLink)}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.6 : 1,
                        })}
                      >
                        <Ionicons
                          name="share-outline"
                          size={24}
                          color={theme.icon.default.icon}
                        />
                      </Pressable>
                    </View>

                    {/* ===================================================== */}
                    {/* DIVIDER */}
                    {/* ===================================================== */}

                    <Divider
                      style={{
                        marginVertical: spacing.md,
                      }}
                    />

                    {/* ===================================================== */}
                    {/* STORE INFO */}
                    {/* ===================================================== */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`View ${store.storeName} information`}
                      onPress={() =>
                        router.push(getStoreDetailsRoute(store.storeId))
                      }
                      style={({ pressed }) => ({
                        flexDirection: "row",

                        justifyContent: "space-between",

                        alignItems: "center",

                        opacity: pressed ? 0.6 : 1,
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
                ))
              ) : (
                /* =========================================================== */
                /* EMPTY STATE */
                /* =========================================================== */

                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,

                    paddingHorizontal: spacing.lg,
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={32}
                    color={theme.icon.default.icon}
                  />

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      marginTop: spacing.sm,
                    }}
                  >
                    No stores found
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    align="center"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    Try changing your search or filter.
                  </AppText>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* ==================================================================== */}
      {/* STOREFRONT FILTER BOTTOM SHEET */}
      {/* ==================================================================== */}

      <StoreFrontBottomSheet
        ref={storeFrontBottomSheetRef}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </SafeAreaView>
  );
}
