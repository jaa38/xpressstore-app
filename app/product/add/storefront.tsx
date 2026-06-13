import { View, Pressable, ScrollView, Switch } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

export default function StorefrontScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      {/* HEADER */}

      <AddProductHeader
        title="Storefront Settings"
        step={4}
        totalSteps={5}
        progress={80}
        label="Storefront"
      />

      <Divider />

      {/* CONTENT */}

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              gap: spacing.xl,
            }}
          >
            <AppText variant="body" color="secondary">
              Choose how this product appears in your storefront.
            </AppText>

            {/* VISIBILITY */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Visibility</AppText>

              <Card>
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
                    <AppText variant="bodyBold">Show in Storefront</AppText>

                    <AppText variant="bodySmall" color="secondary">
                      Customers can view and purchase this product.
                    </AppText>
                  </View>

                  <Switch
                    value={true}
                    trackColor={{
                      false: theme.toggleSwitch.inactive,
                      true: theme.toggleSwitch.active,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </Card>
            </View>

            {/* FEATURED */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Promotion</AppText>

              <Card>
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
                    <AppText variant="bodyBold">Featured Product</AppText>

                    <AppText variant="bodySmall" color="secondary">
                      Highlight this product on your storefront homepage.
                    </AppText>
                  </View>

                  <Switch
                    value={false}
                    trackColor={{
                      false: theme.toggleSwitch.inactive,
                      true: theme.toggleSwitch.active,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </Card>
            </View>

            {/* CATEGORY */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Store Category</AppText>

              <Card>
                <AppText color="secondary">Bags</AppText>
              </Card>
            </View>
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_REVIEW)}
        />
      </View>
    </SafeAreaView>
  );
}
