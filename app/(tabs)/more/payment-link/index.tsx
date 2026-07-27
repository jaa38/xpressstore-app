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

import { spacing, theme, radius } from "@/theme";
import { router } from "expo-router";
import { UICard } from "@/components/ui/UICard";

import { formatCurrency } from "@/utils/formatCurrency";

import { PaymentLinkCard } from "@/components/payment-links/PaymentLinkCard";

import type { PaymentLink, PaymentLinkStatus } from "@/types/paymentLink";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { ROUTES } from "@/navigation/routes";

import { usePaymentLinks } from "@/hooks/paymentLinks/usePaymentLinks";
import { useDeletePaymentLink } from "@/hooks/paymentLinks/useDeletePaymentLink";

function RightActions({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: theme.action.destructive.background,

        borderRadius: radius.md,
      }}
    >
      <Ionicons
        name="trash-outline"
        size={24}
        color={theme.action.destructive.text}
      />

      <AppText color="inverse">Delete</AppText>
    </Pressable>
  );
}

export default function PaymentLinksScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: paymentLinks = [],
    isLoading: loading,
    error,
    refetch,
  } = usePaymentLinks();

  const deletePaymentLinkMutation = useDeletePaymentLink();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const [selectedStatus, setSelectedStatus] =
    useState<PaymentLinkStatus>("all");

  const paymentLinkBottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedPaymentLink, setSelectedPaymentLink] =
    useState<PaymentLink | null>(null);

  const filteredLinks = useMemo(() => {
    return paymentLinks.filter((link) => {
      const matchesStatus =
        selectedStatus === "all" || link.status === selectedStatus;

      const matchesSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [paymentLinks, selectedStatus, searchQuery]);

  const summaryLinks = useMemo(() => {
    return selectedStatus === "all"
      ? filteredLinks.filter((link) => link.status === "paid")
      : filteredLinks;
  }, [filteredLinks, selectedStatus]);

  const totalAmount = useMemo(
    () => summaryLinks.reduce((total, link) => total + link.amount, 0),
    [summaryLinks]
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

  const summaryCurrency = summaryLinks[0]?.currency ?? "NGN";

  const summaryAmount = formatCurrency(totalAmount, {
    currency: summaryCurrency,
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

  function handleDelete(paymentLink: PaymentLink) {
    Alert.alert(
      "Delete Payment Link",
      `Are you sure you want to permanently delete "${paymentLink.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePaymentLinkMutation.mutate(paymentLink.id, {
              onSuccess: () => {
                Alert.alert(
                  "Payment Link Deleted",
                  `"${paymentLink.title}" has been deleted.`
                );
              },

              onError: (error) => {
                Alert.alert(
                  "Delete Failed",
                  error.message ?? "Unable to delete payment link."
                );
              },
            });
          },
        },
      ]
    );
  }

  // 👇 Loading state
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <AppText>Loading payment links...</AppText>
      </SafeAreaView>
    );
  }

  // 👇 Error state
  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <AppText color="error">Failed to load payment links.</AppText>

        <Pressable
          onPress={() => refetch()}
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText color="link">Try Again</AppText>
        </Pressable>
      </SafeAreaView>
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
              onPress={() => router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)}
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
              }}
            >
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search payment links"
              />
            </View>

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
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                {filteredLinks.length === 0 ? (
                  <Card
                    style={{
                      marginTop: spacing.xs,
                      alignItems: "center",
                      // paddingVertical: spacing["2xl"],
                    }}
                  >
                    <Ionicons
                      name="link-outline"
                      size={48}
                      color={theme.text.muted}
                    />

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                      }}
                    >
                      No payment links found
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        textAlign: "center",
                        marginTop: spacing.sm,
                      }}
                    >
                      Create your first payment link to start collecting
                      payments.
                    </AppText>
                  </Card>
                ) : (
                  <View
                    style={{
                      gap: spacing.md,
                    }}
                  >
                    {statusSections.map((section) => {
                      const links = filteredLinks.filter(
                        (link) => link.status === section.status
                      );

                      if (links.length === 0) {
                        return null;
                      }

                      return links.map((link) => (
                        <Swipeable
                          key={link.id}
                          renderRightActions={() => (
                            <RightActions
                              onDelete={() => {
                                if (!deletePaymentLinkMutation.isPending) {
                                  handleDelete(link);
                                }
                              }}
                            />
                          )}
                        >
                          <PaymentLinkCard
                            link={link}
                            badgeBackground={section.badgeBackground}
                            badgeBorderColor={section.badgeBorderColor}
                            badgeText={section.badgeText}
                            badgeTextColor={section.badgeTextColor}
                            onMorePress={(link) => {
                              setSelectedPaymentLink(link);
                              paymentLinkBottomSheetRef.current?.present();
                            }}
                          />
                        </Swipeable>
                      ));
                    })}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      <PaymentLinkBottomSheet
        ref={paymentLinkBottomSheetRef}
        paymentLink={selectedPaymentLink}
      />
    </SafeAreaView>
  );
}
