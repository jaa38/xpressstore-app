import { useState } from "react";
import {
  ActivityIndicator,
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

import { spacing, theme, radius } from "@/theme";
import { router } from "expo-router";
import { UICard } from "@/components/ui/UICard";
import { App } from "expo-router/build/rsc/entry";
import { Divider } from "@/components/ui/Divider";

import type { Currency } from "@/types/currency";

import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentLink {
  id: string;
  title: string;
  url: string;
  createdAt: string;

  amount: number;
  currency: Currency;

  status: Exclude<PaymentLinkStatus, "all">;
}
type PaymentLinkStatus = "all" | "paid" | "pending" | "failed" | "inactive";

const paymentLinks: PaymentLink[] = [
  {
    id: "1",
    title: "Wedding Gele Bundle",
    url: "payx.press/p1",
    createdAt: "Created 2 hours ago",
    amount: 45000,
    currency: "NGN",
    status: "paid",
  },
  {
    id: "2",
    title: "Football Boots",
    url: "payx.press/p2",
    createdAt: "Created 10 hours ago",
    amount: 65000,
    currency: "NGN",
    status: "pending",
  },
  {
    id: "3",
    title: "GTA 6",
    url: "payx.press/p3",
    createdAt: "Yesterday",
    amount: 200000,
    currency: "NGN",
    status: "failed",
  },
  {
    id: "4",
    title: "FIFA 26",
    url: "payx.press/p4",
    createdAt: "23rd July 2026",
    amount: 9000,
    currency: "NGN",
    status: "inactive",
  },
];

export default function PaymentLinksScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Replace later with usePaymentLinks()
  // const paymentLinks: any[] = [];

  const loading = false;
  const error = false;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // TODO:
    // await refetchPaymentLinks();

    setRefreshing(false);
  };

  const [selectedStatus, setSelectedStatus] =
    useState<PaymentLinkStatus>("all");

  const filteredLinks =
    selectedStatus === "all"
      ? paymentLinks
      : paymentLinks.filter((link) => link.status === selectedStatus);

  const summaryLinks =
    selectedStatus === "all"
      ? paymentLinks.filter((link) => link.status === "paid")
      : paymentLinks.filter((link) => link.status === selectedStatus);

  const totalAmount = summaryLinks.reduce(
    (total, link) => total + link.amount,
    0
  );

  const totalLinks = summaryLinks.length;

  const summaryTitle = {
    all: "Collected this week",
    pending: "Pending collection",
    paid: "Collected this week",
    failed: "Failed payments",
    inactive: "Inactive links",
  }[selectedStatus];

  const summaryStatus = {
    all: "All",
    pending: "Active",
    paid: "Paid",
    failed: "Failed",
    inactive: "Inactive",
  }[selectedStatus];

  const summaryStatusColors: Record<PaymentLinkStatus, Color> = {
    all: "strong",
    pending: "warning",
    paid: "success",
    failed: "error",
    inactive: "secondary",
  };

  const summaryStatusColor = summaryStatusColors[selectedStatus];

  const summaryAmount = formatCurrency(totalAmount, {
    currency: "NGN",
    showDecimals: totalAmount % 1 !== 0,
  });

  const paidLinks = filteredLinks.filter((link) => link.status === "paid");

  const pendingLinks = filteredLinks.filter(
    (link) => link.status === "pending"
  );

  const failedLinks = filteredLinks.filter((link) => link.status === "failed");

  const inactiveLinks = filteredLinks.filter(
    (link) => link.status === "inactive"
  );

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
          paddingTop: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                  flex: 1,
                }}
              >
                <AppText variant="h1">Payment Link</AppText>

                <AppText variant="body" color="secondary">
                  {filteredLinks.length === 0
                    ? "No payment links"
                    : filteredLinks.length === 1
                      ? "1 payment link"
                      : `${filteredLinks.length} payment links`}
                </AppText>
              </View>

              <Pressable
                onPress={() => {
                  // Navigate to Add Payment Link
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
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* Summary Card */}
            <Card
              variant="active"
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
                {/* Left Section */}

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  {/* Icon */}

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

                  {/* Content */}

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

                {/* Divider */}

                <View
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    marginHorizontal: spacing.md,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* Right Section */}

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

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <UICard
                title="All"
                variant={selectedStatus === "all" ? "active" : "default"}
                onPress={() => setSelectedStatus("all")}
              />

              <UICard
                title="Active"
                variant={selectedStatus === "pending" ? "active" : "default"}
                onPress={() => setSelectedStatus("pending")}
              />

              <UICard
                title="Paid"
                variant={selectedStatus === "paid" ? "active" : "default"}
                onPress={() => setSelectedStatus("paid")}
              />

              <UICard
                title="Failed"
                variant={selectedStatus === "failed" ? "active" : "default"}
                onPress={() => setSelectedStatus("failed")}
              />

              <UICard
                title="Inactive"
                variant={selectedStatus === "inactive" ? "active" : "default"}
                onPress={() => setSelectedStatus("inactive")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: spacing.md,
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
              {/* Payment link list */}
              <Card
                style={{
                  gap: spacing.md,
                }}
              >
                {/* Successful */}

                {paidLinks.length > 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {/* Left */}

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.md,
                        }}
                      >
                        {/* Icon */}

                        <View
                          style={{
                            width: 48,
                            height: 48,

                            borderRadius: radius.full,

                            justifyContent: "center",
                            alignItems: "center",

                            backgroundColor: theme.icon.success.background,
                          }}
                        >
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={22}
                            color={theme.icon.success.icon}
                          />
                        </View>

                        {/* Content */}

                        <View
                          style={{
                            flex: 1,
                            gap: spacing.xs,
                          }}
                        >
                          <AppText variant="bodyBold" numberOfLines={1}>
                            {paidLink?.title}
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            {paidLink?.url}
                          </AppText>

                          <AppText variant="caption" color="muted">
                            {paidLink?.createdAt}
                          </AppText>
                        </View>
                      </View>

                      {/* Right */}

                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "center",

                          gap: spacing.sm,

                          minWidth: 88,
                        }}
                      >
                        <AppText variant="bodyLargeBold">
                          {paidLink &&
                            formatCurrency(paidLink.amount, {
                              currency: paidLink.currency,
                              showDecimals: paidLink.amount % 1 !== 0,
                            })}
                        </AppText>
                        <View
                          style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: spacing.xs,

                            borderRadius: radius.full,

                            backgroundColor: theme.badge.success.background,
                          }}
                        >
                          <AppText variant="caption" color="success">
                            Paid
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {(pendingLinks.length > 0 ||
                      failedLinks.length > 0 ||
                      inactiveLinks.length > 0) && <Divider />}
                  </>
                )}

                {/* Pending */}

                {pendingLinks.length > 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {/* Left */}

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.md,
                        }}
                      >
                        {/* Icon */}

                        <View
                          style={{
                            width: 48,
                            height: 48,

                            borderRadius: radius.full,

                            justifyContent: "center",
                            alignItems: "center",

                            backgroundColor: theme.icon.warning.background,
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={22}
                            color={theme.icon.warning.icon}
                          />
                        </View>

                        {/* Content */}

                        <View
                          style={{
                            flex: 1,
                            gap: spacing.xs,
                          }}
                        >
                          <AppText variant="bodyBold" numberOfLines={1}>
                            {pendingLink?.title}
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            {pendingLink?.url}
                          </AppText>

                          <AppText variant="caption" color="muted">
                            {pendingLink?.createdAt}
                          </AppText>
                        </View>
                      </View>

                      {/* Right */}

                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "center",

                          gap: spacing.sm,

                          minWidth: 88,
                        }}
                      >
                        <AppText variant="bodyLargeBold">
                          {pendingLink &&
                            formatCurrency(pendingLink.amount, {
                              currency: pendingLink.currency,
                              showDecimals: pendingLink.amount % 1 !== 0,
                            })}
                        </AppText>

                        <View
                          style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: spacing.xs,

                            borderRadius: radius.full,

                            backgroundColor: theme.badge.warning.background,
                          }}
                        >
                          <AppText variant="caption" color="warning">
                            Pending
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {(failedLinks.length > 0 || inactiveLinks.length > 0) && (
                      <Divider />
                    )}
                  </>
                )}

                {/* Failed */}

                {failedLinks.length > 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {/* Left */}

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.md,
                        }}
                      >
                        {/* Icon */}

                        <View
                          style={{
                            width: 48,
                            height: 48,

                            borderRadius: radius.full,

                            justifyContent: "center",
                            alignItems: "center",

                            backgroundColor: theme.icon.error.background,
                          }}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={22}
                            color={theme.icon.error.icon}
                          />
                        </View>

                        {/* Content */}

                        <View
                          style={{
                            flex: 1,
                            gap: spacing.xs,
                          }}
                        >
                          <AppText variant="bodyBold" numberOfLines={1}>
                            {failedLink?.title}
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            {failedLink?.url}
                          </AppText>

                          <AppText variant="caption" color="muted">
                            {failedLink?.createdAt}
                          </AppText>
                        </View>
                      </View>

                      {/* Right */}

                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "center",

                          gap: spacing.sm,

                          minWidth: 88,
                        }}
                      >
                        <AppText variant="bodyLargeBold">
                          {failedLink &&
                            formatCurrency(failedLink.amount, {
                              currency: failedLink.currency,
                              showDecimals: failedLink.amount % 1 !== 0,
                            })}
                        </AppText>

                        <View
                          style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: spacing.xs,

                            borderRadius: radius.full,

                            backgroundColor: theme.badge.error.background,
                          }}
                        >
                          <AppText variant="caption" color="error">
                            Failed
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {inactiveLinks.length > 0 && <Divider />}
                  </>
                )}

                {/* Inactive */}

                {inactiveLinks.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* Left */}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                      }}
                    >
                      {/* Icon */}

                      <View
                        style={{
                          width: 48,
                          height: 48,

                          borderRadius: radius.full,

                          justifyContent: "center",
                          alignItems: "center",

                          backgroundColor: theme.icon.default.background,
                        }}
                      >
                        <Ionicons
                          name="link-outline"
                          size={22}
                          color={theme.icon.default.icon}
                        />
                      </View>

                      {/* Content */}

                      <View
                        style={{
                          flex: 1,
                          gap: spacing.xs,
                        }}
                      >
                        <AppText variant="bodyBold" numberOfLines={1}>
                          {inactiveLink?.title}
                        </AppText>

                        <AppText
                          variant="bodySmall"
                          color="secondary"
                          numberOfLines={1}
                        >
                          {inactiveLink?.url}
                        </AppText>

                        <AppText variant="caption" color="muted">
                          {inactiveLink?.createdAt}
                        </AppText>
                      </View>
                    </View>

                    {/* Right */}

                    <View
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "center",

                        gap: spacing.sm,

                        minWidth: 88,
                      }}
                    >
                      <AppText variant="bodyLargeBold">
                        {inactiveLink &&
                          formatCurrency(inactiveLink.amount, {
                            currency: inactiveLink.currency,
                            showDecimals: inactiveLink.amount % 1 !== 0,
                          })}
                      </AppText>

                      <View
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,

                          borderRadius: radius.full,

                          backgroundColor: theme.background.subtle,

                          borderWidth: 1,
                          borderColor: theme.border.default,
                        }}
                      >
                        <AppText variant="caption" color="secondary">
                          Inactive
                        </AppText>
                      </View>
                    </View>
                  </View>
                )}
              </Card>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
