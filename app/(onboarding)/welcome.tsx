import { View, Image } from "react-native";

import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          justifyContent: "space-between",
        }}
      >
        {/* CONTENT */}

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.sm,
              maxWidth: 320,
            }}
          >
            <View
              style={{
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Image
                source={require("../../assets/logo/xpressStoreLogo.png")}
                style={{
                  width: 211,
                  height: 146,
                  resizeMode: "contain",
                }}
              />

              <AppText variant="body" color="secondary" align="center">
                Create your store, share your link, and get paid securely.
              </AppText>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: spacing.xl,
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                borderRadius: 24,
                backgroundColor: theme.badge.primary.background,
                paddingHorizontal: spacing.rg,
                paddingVertical: spacing.sm,
                flexDirection: "row",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={theme.badge.primary.text}
              />

              <AppText
                variant="bodySmallBold"
                style={{
                  color: theme.badge.primary.text,
                }}
              >
                Secure payments
              </AppText>
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                borderRadius: 24,
                backgroundColor: theme.badge.secondary.background,
                paddingHorizontal: spacing.rg,
                paddingVertical: spacing.sm,
                flexDirection: "row",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={theme.badge.secondary.text}
              />

              <AppText
                variant="bodySmallBold"
                style={{
                  color: theme.badge.secondary.text,
                }}
              >
                CBN-compliant
              </AppText>
            </View>
          </View>
        </View>

        {/* ACTIONS */}

        <View
          style={{
            paddingBottom: spacing.lg,

            flexDirection: "row",

            gap: spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Button
              title="Log In"
              variant="primary"
              size="large"
              onPress={() => router.push(ROUTES.LOGIN)}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Button
              title="Create Account"
              variant="tertiary"
              size="large"
              onPress={() => router.push(ROUTES.SIGNUP)}
            />
          </View>
        </View>
        <AppText variant="caption" color="secondary" align="center">
          Xpress Payments Solutions Limited - Licensed by the Central Bank of
          Nigeria
        </AppText>
      </View>
    </SafeAreaView>
  );
}
