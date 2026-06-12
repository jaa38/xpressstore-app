import { View, ScrollView, Pressable } from "react-native";

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
              Product Variants
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
              Step 3 of 5
            </AppText>

            <AppText
              variant="bodySmallBold"
              color="success"
            >
              Variants
            </AppText>
          </View>

          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={60} />
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
              Add product variations such as size,
              color, material, or style.
            </AppText>

            {/* VARIANT TYPE */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">
                Variant Type
              </AppText>

              <Card>
                <AppText color="secondary">
                  Color
                </AppText>
              </Card>
            </View>

            {/* VARIANT OPTIONS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">
                Variant Options
              </AppText>

              <Card>
                <AppText color="secondary">
                  Red, Blue, Green
                </AppText>
              </Card>
            </View>

            {/* CURRENT VARIANTS */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="label">
                Current Variants
              </AppText>

              <Card>
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <AppText>
                    Color: Red
                  </AppText>

                  <Divider />

                  <AppText>
                    Color: Blue
                  </AppText>

                  <Divider />

                  <AppText>
                    Color: Green
                  </AppText>
                </View>
              </Card>
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
            title="Next"
            onPress={() =>
              router.push(
                ROUTES.ADD_PRODUCT_STOREFRONT
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}