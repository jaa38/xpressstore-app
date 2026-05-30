import { Pressable, View } from "react-native";

import { Link } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OTPInput } from "@/components/ui/OTPInput";

import {
  spacing,
  theme,
} from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function EmailVerificationScreen() {
  function handleVerify(
    code: string
  ) {
    console.log(code);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          paddingHorizontal:
            spacing.lg,
        }}
      >
        <View
          style={{
            flex: 1,

            justifyContent:
              "space-between",
          }}
        >
          <View>
            {/* HEADER */}

            <View
              style={{
                flexDirection:
                  "row",

                alignItems:
                  "center",

                gap:
                  spacing.sm,

                justifyContent:
                  "space-between",
              }}
            >
              <Link
                href={
                  ROUTES.SIGNUP
                }
                asChild
              >
                <Pressable>
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={
                      theme.icon
                        .default
                        .icon
                    }
                  />
                </Pressable>
              </Link>

              <View
                style={{
                  flex: 1,

                  height: 8,

                  backgroundColor:
                    theme.divider
                      .default,

                  borderRadius:
                    999,

                  overflow:
                    "hidden",

                  marginHorizontal:
                    spacing.sm,
                }}
              >
                <ProgressBar
                  progress={25}
                />
              </View>

              <AppText
                variant="bodySmall"
                color="muted"
              >
                Step 1 of 4
              </AppText>
            </View>

            {/* CONTENT */}

            <View
              style={{
                marginTop:
                  spacing.xl,

                gap:
                  spacing.xl,
              }}
            >
              <View
                style={{
                  gap:
                    spacing.xs,
                }}
              >
                <AppText
                  variant="h1"
                  color="heading"
                >
                  Email
                  Verification
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                >
                  A verification
                  code has been
                  sent to your
                  email address.
                </AppText>
              </View>

              <OTPInput
                length={6}
                onComplete={
                  handleVerify
                }
              />

              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  backgroundColor:
                    theme
                      .background
                      .brand,

                  paddingVertical:
                    spacing.rg,

                  paddingHorizontal:
                    spacing.md,

                  borderRadius:
                    10,
                }}
              >
                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap:
                      spacing.sm,
                  }}
                >
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color={
                      theme
                        .icon
                        .success
                        .icon
                    }
                  />

                  <AppText
                    variant="body"
                    color="primary"
                  >
                    Didn't receive
                    OTP?
                  </AppText>
                </View>

                <Pressable>
                  <AppText
                    variant="bodyBold"
                    color="link"
                  >
                    Resend OTP
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          <View
            style={{
              paddingBottom:
                spacing.lg,
            }}
          >
            <Button
              title="Verify Email"
              variant="primary"
              size="large"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}