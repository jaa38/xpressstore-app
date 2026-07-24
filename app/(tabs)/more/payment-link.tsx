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

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";

import { spacing, theme, radius } from "@/theme";
import { router } from "expo-router";
import { UICard } from "@/components/ui/UICard";
import { App } from "expo-router/build/rsc/entry";
import { Divider } from "@/components/ui/Divider";

import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

type PaymentLinkStatus = "all" | "paid" | "pending" | "failed" | "inactive";

interface PaymentLink {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  amount: string;
  status: Exclude<PaymentLinkStatus, "all">;
}

const paymentLinks: PaymentLink[] = [
  {
    id: "1",
    title: "Wedding Gele Bundle",
    url: "payx.press/p1",
    createdAt: "Created 2 hours ago",
    amount: "₦45,000",
    status: "paid",
  },
  {
    id: "2",
    title: "Football Boots",
    url: "payx.press/p2",
    createdAt: "Created 10 hours ago",
    amount: "₦45,000",
    status: "pending",
  },
  {
    id: "3",
    title: "GTA 6",
    url: "payx.press/p3",
    createdAt: "Yesterday",
    amount: "₦45,000",
    status: "failed",
  },
  {
    id: "4",
    title: "FIFA 26",
    url: "payx.press/p4",
    createdAt: "23rd July 2026",
    amount: "₦45,000",
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

  const showPaid = filteredLinks.some((link) => link.status === "paid");
  const showPending = filteredLinks.some((link) => link.status === "pending");
  const showFailed = filteredLinks.some((link) => link.status === "failed");
  const showInactive = filteredLinks.some((link) => link.status === "inactive");

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

                  {/* Amount */}

                  <View
                    style={{
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmallBold" color="muted">
                      Collected this week
                    </AppText>

                    <AppText variant="h1">₦248,750</AppText>
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

                  <AppText variant="h2">3</AppText>

                  <AppText variant="caption" color="success">
                    Active
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
              <Card
                style={{
                  gap: spacing.md,
                }}
              >
                {/* Successful */}

                {showPaid && (
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
                            Wedding Gele Bundle
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            payx.press/p1
                          </AppText>

                          <AppText variant="caption" color="muted">
                            Created 2 hours ago
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
                        <AppText variant="bodyLargeBold">₦75,000</AppText>

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

                    {(showPending || showFailed || showInactive) && <Divider />}
                  </>
                )}

                {/* Pending */}

                {showPending && (
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
                            Football Boots
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            payx.press/p2
                          </AppText>

                          <AppText variant="caption" color="muted">
                            Created 10 hours ago
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
                        <AppText variant="bodyLargeBold">₦205,000</AppText>

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

                    {(showFailed || showInactive) && <Divider />}
                  </>
                )}

                {/* Failed */}

                {showFailed && (
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
                            GTA 6
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            numberOfLines={1}
                          >
                            payx.press/p3
                          </AppText>

                          <AppText variant="caption" color="muted">
                            Yesterday
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
                        <AppText variant="bodyLargeBold">₦45,000</AppText>

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

                    {showInactive && <Divider />}
                  </>
                )}

                {/* Inactive */}

                {showInactive && (
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
                          FIFA 26
                        </AppText>

                        <AppText
                          variant="bodySmall"
                          color="secondary"
                          numberOfLines={1}
                        >
                          payx.press/p4
                        </AppText>

                        <AppText variant="caption" color="muted">
                          23rd July 2026
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
                      <AppText variant="bodyLargeBold">₦9,900.89</AppText>

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
