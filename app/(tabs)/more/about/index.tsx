import { Image, Linking, Pressable, ScrollView, View } from "react-native";

import Constants from "expo-constants";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

const APP_NAME = "XpressStore";
const COMPANY_NAME = "Xpress Payments and Solutions Limited";

const COMPANY_WEBSITE = "https://www.xpresspayments.com";

export default function AboutScreen() {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  async function handleVisitWebsite() {
    const canOpen = await Linking.canOpenURL(COMPANY_WEBSITE);

    if (canOpen) {
      await Linking.openURL(COMPANY_WEBSITE);
    }
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
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.replace(ROUTES.MORE);
            }}
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

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">About</AppText>

            <AppText variant="bodySmall" color="secondary">
              Learn more about XpressStore.
            </AppText>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* App identity */}
          <Card>
            <View
              style={{
                alignItems: "center",
                paddingVertical: spacing.lg,
                // gap: spacing.md,
              }}
            >
              <Image
                source={require("../../../../assets/logo/xpressStoreLogo.png")}
                style={{
                  width: 128,
                  height: 128,
                }}
                resizeMode="contain"
              />

              <View
                style={{
                  alignItems: "center",
                  //   gap: spacing.xs,
                }}
              >
                {/* <AppText variant="h2">{APP_NAME}</AppText> */}

                <AppText variant="bodySmall" color="secondary">
                  Merchant storefront management
                </AppText>
              </View>
            </View>
          </Card>

          {/* About XpressStore */}
          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">About XpressStore</AppText>

            <Card>
              <View style={{ gap: spacing.md }}>
                <AppText variant="body" color="secondary">
                  XpressStore is a merchant storefront application that helps
                  businesses manage their stores, products, orders, payments,
                  and other day-to-day commerce activities.
                </AppText>

                <Divider variant="subtle" />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <Image
                    source={require("../../../../assets/logo/xpressPaymentsLogo.png")}
                    style={{
                      width: 48,
                      height: 48,
                    }}
                    resizeMode="contain"
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">{COMPANY_NAME}</AppText>

                    <AppText variant="bodySmall" color="muted">
                      The company behind XpressStore.
                    </AppText>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* App information */}
          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">App Information</AppText>

            <Card>
              <View style={{ gap: spacing.md }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
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
                      name="information-circle-outline"
                      size={24}
                      color={theme.icon.default.icon}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">Version</AppText>

                    <AppText variant="bodySmall" color="muted">
                      {appVersion}
                    </AppText>
                  </View>
                </View>

                <Divider variant="subtle" />

                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="Visit Xpress Payments website"
                  onPress={handleVisitWebsite}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <Image
                    source={require("../../../../assets/logo/xpressPaymentsLogo2.png")}
                    style={{
                      width: 48,
                      height: 48,
                    }}
                    resizeMode="contain"
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">Xpress Payments</AppText>

                    <AppText variant="bodySmall" color="muted">
                      Visit our website.
                    </AppText>
                  </View>

                  <Ionicons
                    name="open-outline"
                    size={20}
                    color={theme.listItem.default.chevron}
                  />
                </Pressable>
              </View>
            </Card>
          </View>

          {/* Footer */}
          <View
            style={{
              alignItems: "center",
              paddingTop: spacing.md,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodySmall" color="muted">
              {APP_NAME}
            </AppText>

            <AppText variant="bodySmall" color="muted">
              © {new Date().getFullYear()} {COMPANY_NAME}
            </AppText>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
