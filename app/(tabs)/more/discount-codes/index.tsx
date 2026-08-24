import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { UICard } from "@/components/ui/UICard";

import { spacing, theme, radius } from "@/theme";

export default function DiscountCodesScreen() {
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
              <AppText variant="h1">Discount Codes</AppText>

              <AppText variant="body" color="secondary">
                Create and manage promotional discount codes.
              </AppText>
            </View>
          </View>

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: spacing.lg,
              paddingBottom: spacing.xl,
            }}
          >
            {/* SUMMARY CARD */}

            <Card
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radius.full,
                  backgroundColor: theme.background.subtle,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={26}
                  color={theme.icon.default.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h3">Promotional Discounts</AppText>

                <AppText variant="bodySmall" color="muted">
                  Give customers discounts using promotional codes at checkout.
                </AppText>
              </View>
            </Card>

            {/* OVERVIEW */}

            <AppText
              variant="bodyBold"
              color="muted"
              style={{
                marginBottom: spacing.sm,
              }}
            >
              Overview
            </AppText>

            <Card
              style={{
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Active Codes
                  </AppText>

                  <AppText variant="h2">0</AppText>
                </View>

                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.success,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={theme.icon.success.icon}
                  />
                </View>
              </View>

              <Divider />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Total Codes
                  </AppText>

                  <AppText variant="h2">0</AppText>
                </View>

                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="pricetags-outline"
                    size={24}
                    color={theme.icon.default.icon}
                  />
                </View>
              </View>
            </Card>

            {/* DISCOUNT MANAGEMENT */}

            <AppText
              variant="bodyBold"
              color="muted"
              style={{
                marginBottom: spacing.sm,
              }}
            >
              Manage Discount Codes
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* All Discount Codes */}

              <Pressable
                onPress={() => {}}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="pricetags-outline"
                    size={22}
                    color={theme.listItem.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">All Discount Codes</AppText>

                  <AppText variant="bodySmall" color="muted">
                    View and manage your discount codes
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* Create Discount Code */}

              <Pressable
                onPress={() => {}}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.accent,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={theme.icon.accent.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">Create Discount Code</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Create a new promotional discount
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>

            {/* EMPTY STATE */}

            <View
              style={{
                marginTop: spacing.xl,
                alignItems: "center",
                paddingHorizontal: spacing.lg,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: radius.full,
                  backgroundColor: theme.background.subtle,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: spacing.md,
                }}
              >
                <Ionicons
                  name="ticket-outline"
                  size={34}
                  color={theme.icon.default.icon}
                />
              </View>

              <AppText
                variant="h3"
                style={{
                  textAlign: "center",
                  marginBottom: spacing.xs,
                }}
              >
                Create your first discount
              </AppText>

              <AppText
                variant="body"
                color="secondary"
                style={{
                  textAlign: "center",
                }}
              >
                Offer customers special promotions and encourage more sales with
                discount codes.
              </AppText>
            </View>

            {/* PRIMARY ACTION */}

            <View
              style={{
                marginTop: spacing.xl,
              }}
            >
              <Button
                title="Create Discount Code"
                leftIcon={
                  <Ionicons
                    name="add"
                    size={20}
                    color={theme.action.primary.text}
                  />
                }
                onPress={() => {}}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
