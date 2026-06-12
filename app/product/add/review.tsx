import { View, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

export default function ReviewScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      {/* HEADER */}

      <View
        style={{
          backgroundColor: theme.background.surface,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <View
          style={{
            gap: spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={router.back}
              hitSlop={12}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>

            <AppText variant="h3">
              Review Product
            </AppText>

            <Ionicons
              name="close"
              size={24}
              color={theme.icon.default.icon}
            />
          </View>

          <View
            style={{
              marginTop: spacing.rg,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AppText
              variant="bodySmall"
              color="secondary"
            >
              Step 5 of 5
            </AppText>

            <AppText
              variant="bodySmallBold"
              color="success"
            >
              Review
            </AppText>
          </View>

          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={100} />
          </View>
        </View>
      </View>

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
            <AppText
              variant="body"
              color="secondary"
            >
              Review your product details before
              publishing.
            </AppText>

            {/* PRODUCT INFORMATION */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">
                Product Information
              </AppText>

              <Divider />
            </View>

            {/* PRICING */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">
                Pricing & Inventory
              </AppText>

              <Divider />
            </View>

            {/* VARIANTS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">
                Variants
              </AppText>

              <Divider />
            </View>

            {/* STOREFRONT */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">
                Storefront Settings
              </AppText>

              <Divider />
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            backgroundColor:
              theme.background.primary,
          }}
        >
          <Button
            title="Publish Product"
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}