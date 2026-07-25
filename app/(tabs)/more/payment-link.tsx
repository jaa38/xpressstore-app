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

import { formatCurrency } from "@/utils/formatCurrency";

import { PaymentLinkRow } from "@/components/payment-links/PaymentLinkRow";

import { ProductImage } from "@/components/ui/ProductImage";

import type { PaymentLink, PaymentLinkStatus } from "@/types/paymentLink";

const paymentLinks: PaymentLink[] = [
  {
    id: "1",
    title: "Wedding Gele Bundle",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
    url: "payx.press/p1",
    createdAt: "Created 2 hours ago",
    amount: 45000,
    currency: "NGN",
    status: "paid",
  },
  {
    id: "2",
    title: "Football Boots",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    url: "payx.press/p2",
    createdAt: "Created 10 hours ago",
    amount: 65000,
    currency: "NGN",
    status: "pending",
  },
  {
    id: "3",
    title: "GTA 6",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400",
    url: "payx.press/p3",
    createdAt: "Yesterday",
    amount: 200000,
    currency: "NGN",
    status: "failed",
  },
  {
    id: "4",
    title: "FIFA 26",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400",
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

  const statusSections = [
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
              <AppText variant="h1">Payment Link</AppText>

              <AppText variant="body" color="secondary">
                {filteredLinks.length === 0
                  ? "No payment links"
                  : filteredLinks.length === 1
                    ? "1 payment link"
                    : `${filteredLinks.length} payment links`}
              </AppText>
            </View>

            {/* Add Button */}

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
                {statusSections.map((section, sectionIndex) => {
                  const links = filteredLinks.filter(
                    (link) => link.status === section.status
                  );

                  if (links.length === 0) {
                    return null;
                  }

                  const hasNextSection = statusSections
                    .slice(sectionIndex + 1)
                    .some((nextSection) =>
                      filteredLinks.some(
                        (link) => link.status === nextSection.status
                      )
                    );

                  return links.map((link, index) => (
                    <PaymentLinkRow
                      key={link.id}
                      link={link}
                      badgeBackground={section.badgeBackground}
                      badgeBorderColor={section.badgeBorderColor}
                      badgeText={section.badgeText}
                      badgeTextColor={section.badgeTextColor}
                      showDivider={
                        index < links.length - 1 ||
                        (index === links.length - 1 && hasNextSection)
                      }
                    />
                  ));
                })}
              </Card>

            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
