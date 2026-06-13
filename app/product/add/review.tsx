import { View, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

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

      <AddProductHeader
        title="Review Product"
        step={5}
        totalSteps={5}
        progress={100}
        label="Review"
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
              Review your product details before publishing.
            </AppText>

            {/* PRODUCT INFORMATION */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">Product Information</AppText>

              <Divider />
            </View>

            {/* PRICING */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">Pricing & Inventory</AppText>

              <Divider />
            </View>

            {/* VARIANTS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">Variants</AppText>

              <Divider />
            </View>

            {/* STOREFRONT */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="h3">Storefront Settings</AppText>

              <Divider />
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}

        <AddProductFooter
          nextLabel="Publish Product"
          onNext={() => {
            console.log("Publish");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
