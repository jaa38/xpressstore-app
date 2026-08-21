import { useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText, type Color } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { Card } from "@/components/ui/Card";

import { SearchBar } from "@/components/ui/SearchBar";

import { UICard } from "@/components/ui/UICard";

import { spacing, theme, radius } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";

import type { PaymentLink, PaymentLinkStatus } from "@/types/paymentLink";

import { ROUTES } from "@/navigation/routes";

import { usePaymentLinks } from "@/hooks/paymentLinks/usePaymentLinks";

import { usePaymentLinkTransactionMap } from "@/hooks/paymentLinks/usePaymentLinkTransactionMap";

import { getPaymentLinkTransactionStatus } from "@/utils/paymentLinks/getPaymentLinkTransactionStatus";

import { PaymentLinkCard } from "@/components/payment-links/PaymentLinkCard";

import { PaymentLinkBottomSheet } from "@/components/bottom-sheet/PaymentLinkBottomSheet";

import { USE_MOCK_PAYMENT_LINKS } from "@/mocks/config";

import {
  getMockPaymentLinks,
  getMockPaymentLinkTransactionMap,
} from "@/mocks/paymentLinks";

/**
 * ============================================================================
 * INFINITE SCROLL CONFIGURATION
 * ============================================================================
 */

const PAYMENT_LINKS_PER_BATCH = 10;

/**
 * ============================================================================
 * PAYMENT LINK STATUS
 * ============================================================================
 */

function getPaymentLinkStatus(
  link: PaymentLink,
  transactionsByPaymentLinkId: Map<
    number,
    import("@/types/paymentLink").PaymentLinkTransaction[]
  >
): PaymentLinkStatus {
  const transactions = transactionsByPaymentLinkId.get(link.id) ?? [];

  return getPaymentLinkTransactionStatus(link, transactions);
}

/**
 * ============================================================================
 * PAYMENT LINK URL
 * ============================================================================
 */

function getPaymentLinkUrl(link: PaymentLink) {
  return link.paymentLink ?? `https://payx.press/${link.paymentLinkReference}`;
}

/**
 * ============================================================================
 * STATUS SECTIONS
 * ============================================================================
 */

const STATUS_SECTIONS = [
  {
    status: "active" as const,

    badgeText: "Active",

    badgeBackground: theme.badge.success.background,

    badgeTextColor: "success" as const,
  },

  {
    status: "paid" as const,

    badgeText: "Paid",

    badgeBackground: theme.badge.success.background,

    badgeTextColor: "success" as const,
  },

  {
    status: "pending" as const,

    badgeText: "Pending",

    badgeBackground: theme.badge.warning.background,

    badgeTextColor: "warning" as const,
  },

  {
    status: "failed" as const,

    badgeText: "Failed",

    badgeBackground: theme.badge.error.background,

    badgeTextColor: "error" as const,
  },

  {
    status: "inactive" as const,

    badgeText: "Inactive",

    badgeBackground: theme.background.subtle,

    badgeBorderColor: theme.border.default,

    badgeTextColor: "secondary" as const,
  },
];

/**
 * ============================================================================
 * SCREEN
 * ============================================================================
 */

export default function PaymentLinksScreen() {
  /**
   * --------------------------------------------------------------------------
   * STATE
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<PaymentLinkStatus>("all");

  const [selectedPaymentLink, setSelectedPaymentLink] =
    useState<PaymentLink | null>(null);

  const [visiblePaymentLinkCount, setVisiblePaymentLinkCount] = useState(
    PAYMENT_LINKS_PER_BATCH
  );

  const [isLoadingMoreMock, setIsLoadingMoreMock] = useState(false);

  const paymentLinkBottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * --------------------------------------------------------------------------
   * REAL PAYMENT LINKS API
   * --------------------------------------------------------------------------
   */

  const {
    data: paymentLinks,
    isLoading: paymentLinksLoading,
    error: paymentLinksError,
    refetch: refetchPaymentLinks,
  } = usePaymentLinks();

  /**
   * --------------------------------------------------------------------------
   * REAL PAYMENT LINK TRANSACTIONS
   * --------------------------------------------------------------------------
   */

  const realLinks = paymentLinks ?? [];

  const {
    transactionsByPaymentLinkId: realTransactionsByPaymentLinkId,

    isLoading: transactionsLoading,

    hasError: transactionsError,

    refetch: refetchTransactions,
  } = usePaymentLinkTransactionMap(realLinks);

  /**
   * --------------------------------------------------------------------------
   * MOCK DATA
   * --------------------------------------------------------------------------
   */

  const mockLinks = useMemo(() => getMockPaymentLinks(), []);

  const mockTransactions = useMemo(
    () => getMockPaymentLinkTransactionMap(),
    []
  );

  /**
   * --------------------------------------------------------------------------
   * ACTIVE DATA SOURCE
   * --------------------------------------------------------------------------
   */

  const links = USE_MOCK_PAYMENT_LINKS ? mockLinks : realLinks;

  const transactionsByPaymentLinkId = USE_MOCK_PAYMENT_LINKS
    ? mockTransactions
    : realTransactionsByPaymentLinkId;

  const isLoading = USE_MOCK_PAYMENT_LINKS ? false : paymentLinksLoading;

  const error = USE_MOCK_PAYMENT_LINKS ? null : paymentLinksError;

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    if (USE_MOCK_PAYMENT_LINKS) {
      setRefreshing(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setVisiblePaymentLinkCount(PAYMENT_LINKS_PER_BATCH);
      } finally {
        setRefreshing(false);
      }

      return;
    }

    setRefreshing(true);

    try {
      await Promise.all([refetchPaymentLinks(), refetchTransactions()]);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * FILTERING
   * --------------------------------------------------------------------------
   */

  const filteredLinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return links.filter((link) => {
      const status = getPaymentLinkStatus(link, transactionsByPaymentLinkId);

      const matchesStatus =
        selectedStatus === "all" || status === selectedStatus;

      const matchesSearch =
        query.length === 0 ||
        link.name.toLowerCase().includes(query) ||
        getPaymentLinkUrl(link).toLowerCase().includes(query) ||
        link.paymentLinkReference.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [links, selectedStatus, searchQuery, transactionsByPaymentLinkId]);

  /**
   * --------------------------------------------------------------------------
   * RESET INFINITE SCROLL
   * --------------------------------------------------------------------------
   */

  const resetPagination = () => {
    setVisiblePaymentLinkCount(PAYMENT_LINKS_PER_BATCH);
  };

  /**
   * --------------------------------------------------------------------------
   * SUMMARY
   * --------------------------------------------------------------------------
   */

  const summaryLinks = filteredLinks;

  const totalAmount = useMemo(
    () => summaryLinks.reduce((total, link) => total + link.amount, 0),
    [summaryLinks]
  );

  const totalLinks = summaryLinks.length;

  const summaryTitle = {
    all: "Payment Link Value",
    active: "Active Links",
    paid: "Paid Links",
    pending: "Pending Links",
    failed: "Failed Links",
    inactive: "Inactive Links",
  }[selectedStatus];

  const summaryStatus = {
    all: "All",
    active: "Active",
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    inactive: "Inactive",
  }[selectedStatus];

  const summaryStatusColors: Record<PaymentLinkStatus, Color> = {
    all: "strong",
    active: "success",
    paid: "success",
    pending: "warning",
    failed: "error",
    inactive: "secondary",
  };

  const summaryStatusColor = summaryStatusColors[selectedStatus];

  const summaryCurrency = summaryLinks[0]?.currency ?? "NGN";

  const summaryAmount = formatCurrency(totalAmount, {
    currency: summaryCurrency,

    showDecimals: totalAmount % 1 !== 0,
  });

  /**
   * --------------------------------------------------------------------------
   * FILTER STATE
   * --------------------------------------------------------------------------
   */

  const hasActiveFilters = selectedStatus !== "all";

  /**
   * --------------------------------------------------------------------------
   * FIRST-TIME USER
   * --------------------------------------------------------------------------
   */

  const hasPaymentLinks = links.length > 0;

  const isFirstTimeUser =
    !isLoading &&
    !hasPaymentLinks &&
    searchQuery.trim() === "" &&
    selectedStatus === "all";

  /**
   * --------------------------------------------------------------------------
   * PAYMENT LINK ERROR
   * --------------------------------------------------------------------------
   */

  const showPaymentLinkError = !isLoading && !!error && hasPaymentLinks;

  /**
   * --------------------------------------------------------------------------
   * SEARCH / FILTER EMPTY STATE
   * --------------------------------------------------------------------------
   */

  const hasNoSearchResults =
    !isLoading && !error && hasPaymentLinks && filteredLinks.length === 0;

  /**
   * --------------------------------------------------------------------------
   * TRANSACTION ERROR
   * --------------------------------------------------------------------------
   */

  const showTransactionError =
    hasPaymentLinks &&
    !USE_MOCK_PAYMENT_LINKS &&
    !transactionsLoading &&
    transactionsError;

  /**
   * --------------------------------------------------------------------------
   * DISPLAYED LINKS
   * --------------------------------------------------------------------------
   */

  const displayedLinks = useMemo(() => {
    if (!USE_MOCK_PAYMENT_LINKS) {
      return filteredLinks;
    }

    return filteredLinks.slice(0, visiblePaymentLinkCount);
  }, [filteredLinks, visiblePaymentLinkCount]);

  /**
   * --------------------------------------------------------------------------
   * HAS MORE
   * --------------------------------------------------------------------------
   */

  const hasMorePaymentLinks = displayedLinks.length < filteredLinks.length;

  /**
   * --------------------------------------------------------------------------
   * LOAD MORE
   * --------------------------------------------------------------------------
   */

  const loadMorePaymentLinks = () => {
    if (!USE_MOCK_PAYMENT_LINKS) {
      /**
       * API MODE
       *
       * The current usePaymentLinks()
       * hook does not expose pagination.
       *
       * When it is migrated to
       * useInfiniteQuery(), call
       * fetchNextPage() here.
       */

      return;
    }

    if (isLoadingMoreMock || !hasMorePaymentLinks) {
      return;
    }

    setIsLoadingMoreMock(true);

    setTimeout(() => {
      setVisiblePaymentLinkCount((currentCount) =>
        Math.min(currentCount + PAYMENT_LINKS_PER_BATCH, filteredLinks.length)
      );

      setIsLoadingMoreMock(false);
    }, 150);
  };

  /**
   * --------------------------------------------------------------------------
   * RESET PAGINATION WHEN SEARCH / FILTER CHANGES
   * --------------------------------------------------------------------------
   */

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    resetPagination();
  };

  const handleStatusChange = (status: PaymentLinkStatus) => {
    setSelectedStatus(status);

    resetPagination();
  };

  /**
   * --------------------------------------------------------------------------
   * UNSUPPORTED BACKEND ACTIONS
   * --------------------------------------------------------------------------
   */

  function handleDeactivate(paymentLink: PaymentLink) {
    Alert.alert(
      "Deactivate Payment Link",

      `"${paymentLink.name}" cannot be deactivated yet because the documented Payment Pages API does not currently expose a deactivate endpoint.`,

      [
        {
          text: "OK",
          style: "default",
        },
      ]
    );
  }

  /**
   * --------------------------------------------------------------------------
   * LIST DATA
   * --------------------------------------------------------------------------
   *
   * We keep the status sections visually grouped while using FlatList.
   *
   * Each section becomes a list item containing:
   *
   * - optional section header
   * - PaymentLinkCard
   */

  const paymentLinkListData = useMemo(() => {
    const result: Array<{
      type: "warning" | "section";
      key: string;
      status?: PaymentLinkStatus;
      link?: PaymentLink;
    }> = [];

    /**
     * Transaction warning
     */

    if (showTransactionError) {
      result.push({
        type: "warning",
        key: "transaction-warning",
      });
    }

    /**
     * Group links by status.
     */

    const visibleStatusSections = STATUS_SECTIONS.map((section) => {
      const sectionLinks = displayedLinks.filter(
        (link) =>
          getPaymentLinkStatus(link, transactionsByPaymentLinkId) ===
          section.status
      );

      return {
        section,
        sectionLinks,
      };
    }).filter(({ sectionLinks }) => sectionLinks.length > 0);

    /**
     * Flatten into FlatList rows.
     */

    visibleStatusSections.forEach(({ section, sectionLinks }) => {
      sectionLinks.forEach((link, index) => {
        result.push({
          type: "section",
          key: `${section.status}-${link.id}`,
          status: section.status,
          link,
        });
      });
    });

    return result;
  }, [displayedLinks, showTransactionError, transactionsByPaymentLinkId]);

  /**
   * --------------------------------------------------------------------------
   * RENDER PAYMENT LINK ITEM
   * --------------------------------------------------------------------------
   */

  const renderPaymentLinkItem = ({
    item,
  }: {
    item: {
      type: "warning" | "section";
      key: string;
      status?: PaymentLinkStatus;
      link?: PaymentLink;
    };
  }) => {
    /**
     * TRANSACTION WARNING
     */

    if (item.type === "warning") {
      return (
        <Card
          style={{
            borderWidth: 1,

            borderColor: theme.border.error,

            backgroundColor: theme.background.surface,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              alignItems: "center",

              gap: spacing.sm,
            }}
          >
            <Ionicons
              name="warning-outline"
              size={20}
              color={theme.text.error}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <AppText variant="bodySmallBold" color="error">
                Some payment activity could not be loaded
              </AppText>

              <AppText
                variant="caption"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                Payment link statuses may be incomplete. Pull down to try again.
              </AppText>
            </View>
          </View>
        </Card>
      );
    }

    /**
     * PAYMENT LINK
     */

    if (!item.link) {
      return null;
    }

    const section = STATUS_SECTIONS.find(
      (section) => section.status === item.status
    );

    if (!section) {
      return null;
    }

    return (
      <PaymentLinkCard
        link={item.link}
        badgeBackground={section.badgeBackground}
        badgeBorderColor={section.badgeBorderColor}
        badgeText={section.badgeText}
        badgeTextColor={section.badgeTextColor}
        onMorePress={(selectedLink) => {
          setSelectedPaymentLink(selectedLink);

          paymentLinkBottomSheetRef.current?.present();
        }}
      />
    );
  };

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
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
            {/* BACK */}

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

            {/* TITLE */}

            <View
              style={{
                flex: 1,

                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Payment Link</AppText>

              <AppText variant="body" color="secondary">
                {isLoading
                  ? "Loading payment links..."
                  : filteredLinks.length === 0
                    ? "Create your first payment link to start accepting payments"
                    : filteredLinks.length === 1
                      ? "1 payment link"
                      : `${filteredLinks.length} payment links`}
              </AppText>
            </View>

            {/* ADD */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create payment link"
              onPress={() => router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)}
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

          {/* ================================================================
              CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* ==============================================================
                SUMMARY
            ============================================================== */}

            <Card
              variant="active"
              style={{
                marginTop: spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",
                }}
              >
                {/* LEFT */}

                <View
                  style={{
                    flex: 1,

                    flexDirection: "row",

                    alignItems: "center",

                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,

                      borderRadius: radius.full,

                      justifyContent: "center",

                      alignItems: "center",

                      backgroundColor: theme.icon.branding.background,
                    }}
                  >
                    <Ionicons
                      name="link-outline"
                      size={28}
                      color={theme.icon.branding.icon}
                    />
                  </View>

                  <View
                    style={{
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmallBold" color="muted">
                      {summaryTitle}
                    </AppText>

                    <AppText variant="h1">
                      {isLoading ? "—" : summaryAmount}
                    </AppText>
                  </View>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,

                    alignSelf: "stretch",

                    marginHorizontal: spacing.md,

                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* RIGHT */}

                <View
                  style={{
                    alignItems: "center",

                    justifyContent: "center",

                    minWidth: 72,

                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Links
                  </AppText>

                  <AppText variant="h2">{isLoading ? "—" : totalLinks}</AppText>

                  <AppText variant="caption" color={summaryStatusColor}>
                    {summaryStatus}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==============================================================
                SEARCH
            ============================================================== */}

            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.sm,

                marginTop: spacing.md,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <SearchBar
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search payment links"
                />
              </View>
            </View>

            {/* ==============================================================
                STATUS FILTERS
            ============================================================== */}

            <View
              style={{
                flexDirection: "row",

                marginTop: spacing.md,

                gap: spacing.sm,
              }}
            >
              <UICard
                title="All"
                variant={selectedStatus === "all" ? "active" : "default"}
                onPress={() => handleStatusChange("all")}
              />

              <UICard
                title="Active"
                variant={selectedStatus === "active" ? "active" : "default"}
                onPress={() => handleStatusChange("active")}
              />

              <UICard
                title="Paid"
                variant={selectedStatus === "paid" ? "active" : "default"}
                onPress={() => handleStatusChange("paid")}
              />

              <UICard
                title="Failed"
                variant={selectedStatus === "failed" ? "active" : "default"}
                onPress={() => handleStatusChange("failed")}
              />

              <UICard
                title="Inactive"
                variant={selectedStatus === "inactive" ? "active" : "default"}
                onPress={() => handleStatusChange("inactive")}
              />
            </View>

            {/* ==============================================================
                PAYMENT LINK CONTENT
            ============================================================== */}

            <View
              style={{
                flex: 1,

                marginTop: spacing.md,
              }}
            >
              {/* ============================================================
                  LOADING
              ============================================================ */}

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
                    Loading payment links...
                  </AppText>
                </View>
              ) : showPaymentLinkError ? (
                /* ==========================================================
                   ERROR
                ========================================================== */

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
                    Unable to load payment links
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
                    We couldn't load your payment links. Please try again.
                  </AppText>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Try again"
                    onPress={() => refetchPaymentLinks()}
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
                /* ==========================================================
                   FIRST-TIME USER
                ========================================================== */

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
                      name="link-outline"
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
                    No payment links yet
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
                    Create your first payment link to start accepting payments
                    from your customers.
                  </AppText>

                  <Button
                    title="Create Payment Link"
                    variant="primary"
                    style={{
                      marginTop: spacing.lg,
                    }}
                    onPress={() =>
                      router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)
                    }
                  />

                  <AppText
                    variant="caption"
                    color="muted"
                    style={{
                      marginTop: spacing.sm,

                      textAlign: "center",
                    }}
                  >
                    You can share your payment link with customers to collect
                    payments.
                  </AppText>
                </Card>
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   NO SEARCH RESULTS
                ========================================================== */

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
                    No payment links found
                  </AppText>

                  <AppText
                    variant="body"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,

                      textAlign: "center",
                    }}
                  >
                    Try searching with a different name or reference.
                  </AppText>

                  {searchQuery.trim() !== "" && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Clear search"
                      onPress={() => handleSearchChange("")}
                      style={{
                        marginTop: spacing.md,
                      }}
                    >
                      <AppText color="link">Clear Search</AppText>
                    </Pressable>
                  )}

                  {hasActiveFilters && searchQuery.trim() === "" && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Clear payment link filter"
                      onPress={() => handleStatusChange("all")}
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
                   PAYMENT LINK LIST
                ========================================================== */

                <FlatList
                  style={{
                    flex: 1,
                  }}
                  data={paymentLinkListData}
                  keyExtractor={(item) => item.key}
                  renderItem={renderPaymentLinkItem}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={theme.icon.branding.icon}
                      colors={[theme.icon.branding.icon]}
                      progressBackgroundColor={theme.background.surface}
                    />
                  }
                  contentContainerStyle={{
                    paddingTop: spacing.md,

                    paddingBottom: spacing["2xl"],

                    gap: spacing.md,
                  }}
                  onEndReached={loadMorePaymentLinks}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    <>
                      {/* ==================================================
                          LOADING MORE
                      ================================================== */}

                      {isLoadingMoreMock && (
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
                            Loading more payment links...
                          </AppText>
                        </View>
                      )}

                      {/* ==================================================
                          END OF LIST
                      ================================================== */}

                      {!isLoadingMoreMock &&
                        !hasMorePaymentLinks &&
                        displayedLinks.length > 0 && (
                          <View
                            style={{
                              paddingVertical: spacing.lg,

                              alignItems: "center",
                            }}
                          >
                            <AppText variant="caption" color="muted">
                              You've reached the end of your payment links.
                            </AppText>
                          </View>
                        )}
                    </>
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ======================================================================
          PAYMENT LINK BOTTOM SHEET
      ====================================================================== */}

      <PaymentLinkBottomSheet
        ref={paymentLinkBottomSheetRef}
        paymentLink={selectedPaymentLink}
        onViewQRCode={(paymentLink) => {
          router.push({
            pathname: ROUTES.PAYMENT_LINK_QR_CODE,

            params: {
              title: paymentLink.name,

              url: getPaymentLinkUrl(paymentLink),
            },
          });
        }}
        onDeactivateLink={handleDeactivate}
      />
    </SafeAreaView>
  );
}
