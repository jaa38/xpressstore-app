import {
  Linking,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

const SUPPORT_EMAIL = "support@xpresspayments.com";

export default function SupportScreen() {
  async function handleContactSupport() {
    const url = `mailto:${SUPPORT_EMAIL}`;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
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
            <AppText variant="h1">Support</AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
            >
              Get help with your XpressStore account.
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
          {/* Help */}
          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">
              How can we help?
            </AppText>

            <Card>
              <View style={{ gap: spacing.md }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Help Centre"
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
                      backgroundColor:
                        theme.icon.branding.background,
                    }}
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={24}
                      color={theme.icon.branding.icon}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">
                      Help Centre
                    </AppText>

                    <AppText
                      variant="bodySmall"
                      color="muted"
                    >
                      Find answers to common questions.
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.listItem.default.chevron}
                  />
                </Pressable>

                <Divider variant="subtle" />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Contact Support"
                  onPress={handleContactSupport}
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
                      backgroundColor:
                        theme.icon.success.background,
                    }}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={24}
                      color={theme.icon.success.icon}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">
                      Contact Support
                    </AppText>

                    <AppText
                      variant="bodySmall"
                      color="muted"
                    >
                      Get in touch with our support team.
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.listItem.default.chevron}
                  />
                </Pressable>

                <Divider variant="subtle" />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Report a Problem"
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
                      backgroundColor:
                        theme.icon.warning.background,
                    }}
                  >
                    <Ionicons
                      name="bug-outline"
                      size={24}
                      color={theme.icon.warning.icon}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">
                      Report a Problem
                    </AppText>

                    <AppText
                      variant="bodySmall"
                      color="muted"
                    >
                      Tell us about an issue you're experiencing.
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.listItem.default.chevron}
                  />
                </Pressable>
              </View>
            </Card>
          </View>

          {/* FAQ */}
          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">
              Frequently Asked Questions
            </AppText>

            <Card>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Frequently Asked Questions"
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
                    backgroundColor:
                      theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
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
                  <AppText variant="bodyBold">
                    Common Questions
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="muted"
                  >
                    Browse answers to frequently asked questions.
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>

          {/* Contact information */}
          <Card
            style={{
              backgroundColor: theme.background.subtle,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.icon.default.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">
                  Need more help?
                </AppText>

                <AppText
                  variant="bodySmall"
                  color="secondary"
                >
                  Contact our support team and we'll help you
                  resolve your issue.
                </AppText>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}