import { useMemo, useRef, useState } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { PaymentLinkBottomSheet } from "@/components/bottom-sheet/PaymentLinkBottomSheet";

import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText, type Color } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";
import { UICard } from "@/components/ui/UICard";

import { spacing, theme, radius } from "@/theme";

import { router } from "expo-router";

import { formatCurrency } from "@/utils/formatCurrency";

import type {
  PaymentLink,
  PaymentLinkStatus,
} from "@/types/paymentLink";

import { ROUTES } from "@/navigation/routes";

import { usePaymentLinks } from "@/hooks/paymentLinks/usePaymentLinks";
import { PaymentLinkCard } from "@/components/payment-links/PaymentLinkCard";

function getPaymentLinkStatus(
  link: PaymentLink
): PaymentLinkStatus {
  if (!link.isActive) {
    return "inactive";
  }

  /**
   * -------------------------------------------------------------------------
   * Current backend limitation
   * -------------------------------------------------------------------------
   *
   * The current Payment Pages API exposes `isActive`, but does not expose
   * paid / failed / pending payment-link status directly.
   *
   * Active payment links are therefore represented as `pending` in the
   * current UI.
   *
   * Paid / failed states remain in the UI model because transaction data
   * will eventually be used to derive those states.
   */
  return "pending";
}

function getPaymentLinkUrl(link: PaymentLink) {
  return (
    link.paymentLink ||
    `https://payx.press/${link.paymentLinkReference}`
  );
}

export default function PaymentLinksScreen() {
  const [searchQuery, setSearchQuery] =
    useState("");

  const {
    data: paymentLinks = [],
    isLoading: loading,
    error,
    refetch,
  } = usePaymentLinks();

  const [refreshing, setRefreshing] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<PaymentLinkStatus>("all");

  const paymentLinkBottomSheetRef =
    useRef<BottomSheetModal>(null);

  const [selectedPaymentLink, setSelectedPaymentLink] =
    useState<PaymentLink | null>(null);

  /**
   * -------------------------------------------------------------------------
   * Refresh
   * -------------------------------------------------------------------------
   */
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * -------------------------------------------------------------------------
   * Filtering
   * -------------------------------------------------------------------------
   */
  const filteredLinks = useMemo(() => {
    return paymentLinks.filter((link) => {
      const status = getPaymentLinkStatus(link);

      const matchesStatus =
        selectedStatus === "all" ||
        status === selectedStatus;

      const query = searchQuery
        .trim()
        .toLowerCase();

      const matchesSearch =
        link.name
          .toLowerCase()
          .includes(query) ||
        getPaymentLinkUrl(link)
          .toLowerCase()
          .includes(query) ||
        link.paymentLinkReference
          .toLowerCase()
          .includes(query);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    paymentLinks,
    selectedStatus,
    searchQuery,
  ]);

  /**
   * -------------------------------------------------------------------------
   * Summary
   * -------------------------------------------------------------------------
   */
  const summaryLinks = filteredLinks;

  const totalAmount = useMemo(
    () =>
      summaryLinks.reduce(
        (total, link) =>
          total + link.amount,
        0
      ),
    [summaryLinks]
  );

  const totalLinks =
    summaryLinks.length;

  const summaryTitle = {
    all: "Payment Link Value",

    pending: "Active Links",

    paid: "Paid Links",

    failed: "Failed Links",

    inactive: "Inactive Links",
  }[selectedStatus];

  const summaryStatus = {
    all: "All",

    pending: "Active",

    paid: "Paid",

    failed: "Failed",

    inactive: "Inactive",
  }[selectedStatus];

  const summaryStatusColors: Record<
    PaymentLinkStatus,
    Color
  > = {
    all: "strong",

    pending: "warning",

    paid: "success",

    failed: "error",

    inactive: "secondary",
  };

  const summaryStatusColor =
    summaryStatusColors[
      selectedStatus
    ];

  const summaryCurrency =
    summaryLinks[0]?.currency ??
    "NGN";

  const summaryAmount =
    formatCurrency(
      totalAmount,
      {
        currency:
          summaryCurrency,

        showDecimals:
          totalAmount % 1 !== 0,
      }
    );

  /**
   * -------------------------------------------------------------------------
   * Status Sections
   * -------------------------------------------------------------------------
   *
   * Only statuses currently derivable from the Payment Pages API are rendered
   * as actual sections.
   *
   * `paid` and `failed` remain available as UI filter states for future
   * transaction integration.
   */
  const statusSections = [
    {
      status: "pending" as const,

      badgeText: "Active",

      badgeBackground:
        theme.badge.success.background,

      badgeTextColor:
        "success" as const,
    },

    {
      status: "inactive" as const,

      badgeText: "Inactive",

      badgeBackground:
        theme.background.subtle,

      badgeBorderColor:
        theme.border.default,

      badgeTextColor:
        "secondary" as const,
    },
  ];

  /**
   * -------------------------------------------------------------------------
   * Unsupported Backend Actions
   * -------------------------------------------------------------------------
   *
   * The documented Payment Pages API currently does not expose:
   *
   * - DELETE /PaymentPages/...
   * - POST /PaymentPages/Deactivate
   * - POST /PaymentPages/Toggle
   *
   * Therefore these actions must not make undocumented API requests.
   *
   * The UI can retain the functionality for future backend support, but for
   * now it explains the limitation to the user.
   */
  function handleDeactivate(
    paymentLink: PaymentLink
  ) {
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
   * -------------------------------------------------------------------------
   * Loading State
   * -------------------------------------------------------------------------
   */
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          justifyContent:
            "center",

          alignItems:
            "center",

          backgroundColor:
            theme.background.primary,
        }}
      >
        <AppText>
          Loading payment links...
        </AppText>
      </SafeAreaView>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * Error State
   * -------------------------------------------------------------------------
   */
  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          justifyContent:
            "center",

          alignItems:
            "center",

          backgroundColor:
            theme.background.primary,
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.text.error}
        />

        <AppText
          variant="bodyLargeBold"
          style={{
            marginTop:
              spacing.md,
          }}
        >
          Unable to load payment links
        </AppText>

        <Pressable
          onPress={() => {
            refetch();
          }}
          style={{
            marginTop:
              spacing.md,
          }}
        >
          <AppText color="link">
            Try Again
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          paddingHorizontal:
            spacing.lg,
        }}
      >
        <View
          style={{
            flex: 1,

            justifyContent:
              "space-between",
          }}
        >
          {/* -----------------------------------------------------------------
              HEADER
          ----------------------------------------------------------------- */}

          <View
            style={{
              flexDirection:
                "row",

              alignItems:
                "center",

              gap: spacing.md,
            }}
          >
            {/* Back Button */}

            <Pressable
              onPress={() =>
                router.back()
              }
              style={{
                width: 44,

                height: 44,

                justifyContent:
                  "center",

                alignItems:
                  "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={
                  theme.text.primary
                }
              />
            </Pressable>

            {/* Title */}

            <View
              style={{
                flex: 1,

                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">
                Payment Link
              </AppText>

              <AppText
                variant="body"
                color="secondary"
              >
                {filteredLinks.length ===
                0
                  ? "No payment links"
                  : filteredLinks.length ===
                      1
                    ? "1 payment link"
                    : `${filteredLinks.length} payment links`}
              </AppText>
            </View>

            {/* Add Button */}

            <Pressable
              onPress={() =>
                router.push(
                  ROUTES.ADD_PAYMENT_LINK_INFORMATION
                )
              }
              style={{
                width: 44,

                height: 44,

                borderRadius:
                  radius.full,

                justifyContent:
                  "center",

                alignItems:
                  "center",

                backgroundColor:
                  theme.action.primary
                    .background,
              }}
            >
              <Ionicons
                name="add"
                size={24}
                color={
                  theme.action.primary
                    .text
                }
              />
            </Pressable>
          </View>

          {/* -----------------------------------------------------------------
              CONTENT
          ----------------------------------------------------------------- */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* Summary Card */}

            <Card
              variant="active"
              style={{
                marginTop:
                  spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",
                }}
              >
                {/* Left Section */}

                <View
                  style={{
                    flex: 1,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap: spacing.md,
                  }}
                >
                  {/* Icon */}

                  <View
                    style={{
                      width: 56,

                      height: 56,

                      borderRadius:
                        radius.full,

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      backgroundColor:
                        theme.icon
                          .branding
                          .background,
                    }}
                  >
                    <Ionicons
                      name="link-outline"
                      size={28}
                      color={
                        theme.icon
                          .branding
                          .icon
                      }
                    />
                  </View>

                  {/* Content */}

                  <View
                    style={{
                      gap: spacing.xs,
                    }}
                  >
                    <AppText
                      variant="bodySmallBold"
                      color="muted"
                    >
                      {
                        summaryTitle
                      }
                    </AppText>

                    <AppText variant="h1">
                      {
                        summaryAmount
                      }
                    </AppText>
                  </View>
                </View>

                {/* Divider */}

                <View
                  style={{
                    width: 1,

                    alignSelf:
                      "stretch",

                    marginHorizontal:
                      spacing.md,

                    backgroundColor:
                      theme.divider
                        .strong,
                  }}
                />

                {/* Right Section */}

                <View
                  style={{
                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    minWidth: 72,

                    gap: spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmallBold"
                    color="muted"
                  >
                    Links
                  </AppText>

                  <AppText variant="h2">
                    {totalLinks}
                  </AppText>

                  <AppText
                    variant="caption"
                    color={
                      summaryStatusColor
                    }
                  >
                    {
                      summaryStatus
                    }
                  </AppText>
                </View>
              </View>
            </Card>

            {/* Search */}

            <View
              style={{
                marginTop:
                  spacing.md,
              }}
            >
              <SearchBar
                value={
                  searchQuery
                }
                onChangeText={
                  setSearchQuery
                }
                placeholder="Search payment links"
              />
            </View>

            {/* Status Filters */}

            <View
              style={{
                marginTop:
                  spacing.md,

                flexDirection:
                  "row",

                justifyContent:
                  "space-between",
              }}
            >
              <UICard
                title="All"
                variant={
                  selectedStatus ===
                  "all"
                    ? "active"
                    : "default"
                }
                onPress={() =>
                  setSelectedStatus(
                    "all"
                  )
                }
              />

              <UICard
                title="Active"
                variant={
                  selectedStatus ===
                  "pending"
                    ? "active"
                    : "default"
                }
                onPress={() =>
                  setSelectedStatus(
                    "pending"
                  )
                }
              />

              <UICard
                title="Paid"
                variant={
                  selectedStatus ===
                  "paid"
                    ? "active"
                    : "default"
                }
                onPress={() =>
                  setSelectedStatus(
                    "paid"
                  )
                }
              />

              <UICard
                title="Failed"
                variant={
                  selectedStatus ===
                  "failed"
                    ? "active"
                    : "default"
                }
                onPress={() =>
                  setSelectedStatus(
                    "failed"
                  )
                }
              />

              <UICard
                title="Inactive"
                variant={
                  selectedStatus ===
                  "inactive"
                    ? "active"
                    : "default"
                }
                onPress={() =>
                  setSelectedStatus(
                    "inactive"
                  )
                }
              />
            </View>

            {/* Payment Link List */}

            <ScrollView
              style={{
                flex: 1,
              }}
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingTop:
                  spacing.md,

                paddingBottom:
                  spacing["2xl"],
              }}
              refreshControl={
                <RefreshControl
                  refreshing={
                    refreshing
                  }
                  onRefresh={
                    onRefresh
                  }
                  tintColor={
                    theme.action
                      .primary
                      .background
                  }
                  colors={[
                    theme.action
                      .primary
                      .background,
                  ]}
                />
              }
            >
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                {filteredLinks.length ===
                0 ? (
                  <Card
                    style={{
                      marginTop:
                        spacing.xs,

                      alignItems:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="link-outline"
                      size={48}
                      color={
                        theme.text
                          .muted
                      }
                    />

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop:
                          spacing.md,
                      }}
                    >
                      No payment links
                      found
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        textAlign:
                          "center",

                        marginTop:
                          spacing.sm,
                      }}
                    >
                      Create your
                      first payment
                      link to start
                      collecting
                      payments.
                    </AppText>
                  </Card>
                ) : (
                  <View
                    style={{
                      gap: spacing.md,
                    }}
                  >
                    {statusSections.map(
                      (
                        section
                      ) => {
                        const links =
                          filteredLinks.filter(
                            (link) =>
                              getPaymentLinkStatus(
                                link
                              ) ===
                              section.status
                          );

                        if (
                          links.length ===
                          0
                        ) {
                          return null;
                        }

                        return links.map(
                          (
                            link
                          ) => (
                            <PaymentLinkCard
                              key={
                                link.id
                              }
                              link={
                                link
                              }
                              badgeBackground={
                                section.badgeBackground
                              }
                              badgeBorderColor={
                                section.badgeBorderColor
                              }
                              badgeText={
                                section.badgeText
                              }
                              badgeTextColor={
                                section.badgeTextColor
                              }
                              onMorePress={(
                                selectedLink
                              ) => {
                                setSelectedPaymentLink(
                                  selectedLink
                                );

                                paymentLinkBottomSheetRef.current?.present();
                              }}
                            />
                          )
                        );
                      }
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* ---------------------------------------------------------------------
          Payment Link Bottom Sheet
      --------------------------------------------------------------------- */}

      <PaymentLinkBottomSheet
        ref={
          paymentLinkBottomSheetRef
        }
        paymentLink={
          selectedPaymentLink
        }
        onViewQRCode={(
          paymentLink
        ) => {
          router.push({
            pathname:
              ROUTES.PAYMENT_LINK_QR_CODE,

            params: {
              title:
                paymentLink.name,

              url:
                getPaymentLinkUrl(
                  paymentLink
                ),
            },
          });
        }}
        onDeactivateLink={
          handleDeactivate
        }
      />
    </SafeAreaView>
  );
}