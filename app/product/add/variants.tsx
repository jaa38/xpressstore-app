import { View, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";
import { router } from "expo-router";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

export default function VariantsScreen() {
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
        title="Product Variants"
        step={3}
        totalSteps={5}
        progress={60}
        label="Variants"
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
              Add product variations such as size, color, material, or style.
            </AppText>

            {/* VARIANT TYPE */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Variant Type</AppText>

              <Card>
                <AppText color="secondary">Color</AppText>
              </Card>
            </View>

            {/* VARIANT OPTIONS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Variant Options</AppText>

              <Card>
                <AppText color="secondary">Red, Blue, Green</AppText>
              </Card>
            </View>

            {/* CURRENT VARIANTS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">Current Variants</AppText>

              <Card>
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <AppText>Color: Red</AppText>

                  <Divider />

                  <AppText>Color: Blue</AppText>

                  <Divider />

                  <AppText>Color: Green</AppText>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_STOREFRONT)}
        />
      </View>
    </SafeAreaView>
  );
}
