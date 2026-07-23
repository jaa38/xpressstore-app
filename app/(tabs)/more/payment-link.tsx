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

export default function PaymentLinksScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Replace later with usePaymentLinks()
  const paymentLinks: any[] = [];

  const loading = false;
  const error = false;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // TODO:
    // await refetchPaymentLinks();

    setRefreshing(false);
  };

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
                }}
              >
                <AppText variant="h1">Payment Link</AppText>

                <AppText variant="body" color="secondary">
                  Create payment links.
                </AppText>
              </View>

              <Button
                title="Add Payment Link"
                variant="primary"
                onPress={() => {
                  // Navigate to create payment link
                }}
              />
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
              <UICard title="All" />
              <UICard title="Paid" />
              <UICard title="Pending" />
              <UICard title="Failed" />
              <UICard title="Inactive" />
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
                    <AppText variant="bodyLargeBold">₦45,000</AppText>

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

                <Divider />

                {/* Pending */}
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
                    <AppText variant="bodyLargeBold">₦45,000</AppText>

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

                <Divider />

                {/* Failed */}
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

                <Divider />

                {/* Inactive */}
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
                    <AppText variant="bodyLargeBold">₦45,000</AppText>

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
              </Card>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
