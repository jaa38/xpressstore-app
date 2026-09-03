import { useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
  Image,
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

import type {
  PaymentLink,
  PaymentLinkStatus,
  PaymentLinkTransaction,
} from "@/types/paymentLink";

import { ROUTES } from "@/navigation/routes";

import { usePaymentLinks } from "@/hooks/paymentLinks/usePaymentLinks";

import { usePaymentLinkTransactionMap } from "@/hooks/paymentLinks/usePaymentLinkTransactionMap";

import { getPaymentLinkTransactionStatus } from "@/utils/paymentLinks/getPaymentLinkTransactionStatus";

import { PaymentLinkCard } from "@/components/payment-links/PaymentLinkCard";

import { PaymentLinkBottomSheet } from "@/components/bottom-sheet/PaymentLinkBottomSheet";

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
  transactionsByPaymentLinkId: Map<number, PaymentLinkTransaction[]>
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
 * LIST ITEM TYPES
 * ============================================================================
 */

type PaymentLinkListItem =
  | {
      type: "warning";
      key: string;
    }
  | {
      type: "section";
      key: string;
      status: PaymentLinkStatus;
      link: PaymentLink;
    };

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

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paymentLinkBottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * --------------------------------------------------------------------------
   * PAYMENT LINKS
   * --------------------------------------------------------------------------
   *
   * Mock/API selection is handled by paymentLinkService.
   *
   * The screen does not know whether the data comes from
   * the backend or local mock storage.
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
   * PAYMENT LINK TRANSACTIONS
   * --------------------------------------------------------------------------
   */

  const realLinks = paymentLinks ?? [];

  const {
    transactionsByPaymentLinkId,
    isLoading: transactionsLoading,
    hasError: transactionsError,
    refetch: refetchTransactions,
  } = usePaymentLinkTransactionMap(realLinks);

  /**
   * --------------------------------------------------------------------------
   * ACTIVE DATA SOURCE
   * --------------------------------------------------------------------------
   *
   * There is intentionally no mock-specific logic here.
   *
   * usePaymentLinks() and usePaymentLinkTransactionMap()
   * already receive their data through paymentLinkService.
   * --------------------------------------------------------------------------
   */

  const links = realLinks;

  const isLoading = paymentLinksLoading;

  const error = paymentLinksError;

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetchPaymentLinks(), refetchTransactions()]);

      setVisiblePaymentLinkCount(PAYMENT_LINKS_PER_BATCH);
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
   * RESET PAGINATION
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

  /**
   * --------------------------------------------------------------------------
   * SUMMARY STATUS TEXT COLOUR
   * --------------------------------------------------------------------------
   */

  const summaryStatusColors: Record<PaymentLinkStatus, Color> = {
    all: "strong",
    active: "success",
    paid: "success",
    pending: "warning",
    failed: "error",
    inactive: "secondary",
  };

  const summaryStatusColor = summaryStatusColors[selectedStatus];

  /**
   * --------------------------------------------------------------------------
   * SUMMARY CARD COLOUR
   * --------------------------------------------------------------------------
   *
   * All      -> active
   * Active   -> success
   * Paid     -> success
   * Pending  -> warning
   * Failed   -> error
   * Inactive -> default
   * --------------------------------------------------------------------------
   */

  const summaryCardVariant =
    selectedStatus === "failed"
      ? "error"
      : selectedStatus === "pending"
        ? "warning"
        : selectedStatus === "inactive"
          ? "default"
          : selectedStatus === "active" || selectedStatus === "paid"
            ? "success"
            : "active";

  /**
   * --------------------------------------------------------------------------
   * SUMMARY ICON
   * --------------------------------------------------------------------------
   *
   * All
   * -> paymentLinksIconAll.png
   *
   * Active
   * -> paymentLinksIconActive.png
   *
   * Paid
   * -> paymentLinksIconPaid.png
   *
   * Failed
   * -> paymentLinksIconFailed.png
   *
   * Inactive
   * -> paymentLinksIconInactive.png
   *
   * Pending currently has no separate icon in the supplied icon list,
   * so it falls back to the All icon.
   * --------------------------------------------------------------------------
   */

  const summaryIconSource =
    selectedStatus === "active"
      ? require("../../../../assets/icons/payment-links/paymentLinksIconActive.png")
      : selectedStatus === "paid"
        ? require("../../../../assets/icons/payment-links/paymentLinksIconPaid.png")
        : selectedStatus === "failed"
          ? require("../../../../assets/icons/payment-links/paymentLinksIconFailed.png")
          : selectedStatus === "inactive"
            ? require("../../../../assets/icons/payment-links/paymentLinksIconInactive.png")
            : require("../../../../assets/icons/payment-links/paymentLinksIconAll.png");

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
   *
   * A brand-new merchant with no payment links should see
   * the onboarding state rather than management controls.
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
   *
   * Only show the technical error once payment links already exist.
   *
   * A brand-new merchant should not see an API error instead of
   * the friendly empty state.
   * --------------------------------------------------------------------------
   */

  const showPaymentLinkError = !isLoading && !!error && hasPaymentLinks;

  /**
   * --------------------------------------------------------------------------
   * SEARCH / FILTER EMPTY STATE
   * --------------------------------------------------------------------------
   */

  const hasNoSearchResults =
    !isLoading &&
    !showPaymentLinkError &&
    hasPaymentLinks &&
    filteredLinks.length === 0;

  /**
   * --------------------------------------------------------------------------
   * TRANSACTION ERROR
   * --------------------------------------------------------------------------
   */

  const showTransactionError =
    hasPaymentLinks && !transactionsLoading && transactionsError;

  /**
   * --------------------------------------------------------------------------
   * DISPLAYED LINKS
   * --------------------------------------------------------------------------
   *
   * Pagination is currently simulated locally.
   *
   * This allows the UI to support incremental loading while
   * the backend remains non-paginated.
   * --------------------------------------------------------------------------
   */

  const displayedLinks = useMemo(() => {
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
    if (isLoadingMore || !hasMorePaymentLinks) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisiblePaymentLinkCount((currentCount) =>
        Math.min(currentCount + PAYMENT_LINKS_PER_BATCH, filteredLinks.length)
      );

      setIsLoadingMore(false);
    }, 150);
  };

  /**
   * --------------------------------------------------------------------------
   * SEARCH / STATUS CHANGE
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
   * Payment links are grouped by status.
   *
   * Each section becomes a list item containing:
   *
   * - optional transaction warning
   * - PaymentLinkCard
   * --------------------------------------------------------------------------
   */

  const paymentLinkListData = useMemo<PaymentLinkListItem[]>(() => {
    const result: PaymentLinkListItem[] = [];

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
      sectionLinks.forEach((link) => {
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

  const renderPaymentLinkItem = ({ item }: { item: PaymentLinkListItem }) => {
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

    const section = STATUS_SECTIONS.find(
      (statusSection) => statusSection.status === item.status
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
              hitSlop={10}
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
                  : isFirstTimeUser
                    ? "Create your first payment link to start accepting payments"
                    : links.length === 1
                      ? "1 payment link"
                      : `${links.length} payment links`}
              </AppText>
            </View>

            {/* ADD */}

            {!isFirstTimeUser && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create payment link"
                hitSlop={8}
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
            )}
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

            {!isFirstTimeUser && (
              <Card
                variant={summaryCardVariant}
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
                      <Image
                        source={summaryIconSource}
                        style={{
                          width: 56,
                          height: 56,
                        }}
                        resizeMode="contain"
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

                      <AppText variant="h1">{summaryAmount}</AppText>
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

                    <AppText variant="h2">{totalLinks}</AppText>

                    <AppText variant="caption" color={summaryStatusColor}>
                      {summaryStatus}
                    </AppText>
                  </View>
                </View>
              </Card>
            )}

            {/* ==============================================================
                SEARCH
            ============================================================== */}

            {!isFirstTimeUser && (
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
            )}

            {/* ==============================================================
                STATUS FILTERS
            ============================================================== */}

            {!isFirstTimeUser && (
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
            )}

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
              ) : isFirstTimeUser ? (
                /* ==========================================================
                   FIRST-TIME USER
                ========================================================== */

                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Card
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.xl,
                      paddingHorizontal: spacing.lg,
                    }}
                  >
                    {/* PAYMENT LINK IMAGE */}

                    <Image
                      source={require("../../../../assets/images/default-payment-link.png")}
                      style={{
                        width: 128,
                        height: 128,
                      }}
                      resizeMode="contain"
                    />

                    {/* TITLE */}

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      No payment links yet
                    </AppText>

                    {/* DESCRIPTION */}

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

                    {/* CTA */}

                    <Button
                      title="Create Payment Link"
                      variant="primary"
                      leftIcon={
                        <Ionicons
                          name="add"
                          size={20}
                          color={theme.action.primary.text}
                        />
                      }
                      style={{
                        marginTop: spacing.lg,
                      }}
                      onPress={() =>
                        router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)
                      }
                    />

                    {/* SUPPORTING TEXT */}

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
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   NO SEARCH / FILTER RESULTS
                ========================================================== */

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
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
                </View>
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
                            Loading more payment links...
                          </AppText>
                        </View>
                      )}

                      {/* ==================================================
                          END OF LIST
                      ================================================== */}

                      {!isLoadingMore &&
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
