import { Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

/**
 * ============================================================================
 * SECURITY SCREEN
 * ============================================================================
 */

export default function SecurityScreen() {
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
        {/* ==================================================================
            HEADER
        ================================================================== */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {/* BACK BUTTON */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          {/* TITLE */}

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Security</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your password and account security settings.
            </AppText>
          </View>
        </View>

        {/* ==================================================================
            CONTENT
        ================================================================== */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ================================================================
              SECURITY OVERVIEW
          ================================================================ */}

          <Card
            style={{
              padding: spacing.lg,
              backgroundColor: theme.state.success.background,
              borderColor: theme.state.success.border,
              borderWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* ICON */}

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
                  name="shield-checkmark-outline"
                  size={26}
                  color={theme.icon.success.icon}
                />
              </View>

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">
                  Your account is secure
                </AppText>

                <AppText variant="bodySmall" color="success">
                  Your security settings are helping protect your XpressStore
                  account.
                </AppText>
              </View>
            </View>
          </Card>

          {/* ================================================================
              SECURITY SETTINGS
          ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">Security Settings</AppText>

            <AppText variant="bodySmall" color="muted">
              Manage how you access and protect your account.
            </AppText>
          </View>

          {/* ================================================================
              PASSWORD
          ================================================================ */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change password"
              onPress={() => router.push(ROUTES.CHANGE_PASSWORD)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {/* ICON */}

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.branding.background,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={theme.icon.branding.icon}
                />
              </View>

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Password</AppText>

                <AppText variant="bodySmall" color="muted">
                  Change your account password.
                </AppText>
              </View>

              {/* CHEVRON */}

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.listItem.default.chevron}
              />
            </Pressable>
          </Card>

          {/* ================================================================
              ADDITIONAL SECURITY
          ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">Additional Security</AppText>

            <AppText variant="bodySmall" color="muted">
              Add another layer of protection to your account.
            </AppText>
          </View>

          {/* ================================================================
              BIOMETRIC AUTHENTICATION
          ================================================================ */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Manage biometric authentication"
              onPress={() => router.push(ROUTES.BIOMETRIC_AUTHENTICATION)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {/* ICON */}

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.default.background,
                }}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={24}
                  color={theme.icon.default.icon}
                />
              </View>

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Biometric Authentication</AppText>

                <AppText variant="bodySmall" color="muted">
                  Use Face ID or Touch ID to access your account.
                </AppText>
              </View>

              {/* CHEVRON */}

              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.listItem.default.chevron}
              />
            </Pressable>
          </Card>

          {/* ================================================================
              LOGIN ACTIVITY
          ================================================================ */}

          {/* <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View login activity"
              onPress={() => {}}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                opacity: pressed ? 0.7 : 1,
              })}
            >

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.default.background,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={theme.icon.default.icon}
                />
              </View>


              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Login Activity</AppText>

                <AppText variant="bodySmall" color="muted">
                  Review devices and recent account activity.
                </AppText>
              </View>


              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.listItem.default.chevron}
              />
            </Pressable>
          </Card> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
