import { Pressable, View } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

import {
  radius,
  spacing,
  theme,
} from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function BiometricVerificationScreen() {
  function handleVerification() {
    console.log(
      "Biometric Verification Started"
    );

    router.push(
      ROUTES.TABS
    );
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
              ROUTES.ID_VERIFICATION
            }
            asChild
          >
            <Pressable>
              <Ionicons
                name="chevron-back"
                size={24}
                color={
                  theme.icon
                    .default.icon
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
              progress={100}
            />
          </View>

          <AppText
            variant="bodySmall"
            color="muted"
          >
            Step 4 of 4
          </AppText>
        </View>

        <View
          style={{
            flex: 1,

            justifyContent:
              "space-between",
          }}
        >
          <View>
            {/* TITLE */}

            <View
              style={{
                marginTop:
                  spacing.lg,

                gap:
                  spacing.xs,
              }}
            >
              <AppText
                variant="h1"
                color="heading"
              >
                Biometric
                Verification
              </AppText>

              <AppText
                variant="body"
                color="secondary"
              >
                Take a selfie to
                confirm your
                identity and
                complete account
                verification.
              </AppText>
            </View>

            {/* INFO CARD */}

            <View
              style={{
                marginTop:
                  spacing.xl,

                padding:
                  spacing.lg,

                borderRadius:
                  radius.md,

                backgroundColor:
                  theme.background
                    .brand,

                alignItems:
                  "center",

                gap:
                  spacing.md,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={80}
                color={
                  theme.icon
                    .success.icon
                }
              />

              <AppText
                variant="body"
                color="strong"
                style={{
                  textAlign:
                    "center",
                }}
              >
                Ensure your face
                is clearly visible
                in a well-lit
                environment.
              </AppText>
            </View>

            {/* TIPS */}

            <View
              style={{
                marginTop:
                  spacing.xl,

                gap:
                  spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  gap:
                    spacing.sm,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={
                    theme.icon
                      .success.icon
                  }
                />

                <AppText
                  variant="body"
                >
                  Remove hats,
                  sunglasses, and
                  face coverings.
                </AppText>
              </View>

              <View
                style={{
                  flexDirection:
                    "row",

                  gap:
                    spacing.sm,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={
                    theme.icon
                      .success.icon
                  }
                />

                <AppText
                  variant="body"
                >
                  Make sure your
                  face fits within
                  the camera frame.
                </AppText>
              </View>

              <View
                style={{
                  flexDirection:
                    "row",

                  gap:
                    spacing.sm,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={
                    theme.icon
                      .success.icon
                  }
                />

                <AppText
                  variant="body"
                >
                  Use a bright
                  environment for
                  better accuracy.
                </AppText>
              </View>
            </View>
          </View>

          {/* FOOTER */}

          <View
            style={{
              paddingBottom:
                spacing.lg,
            }}
          >
            <Button
              title="Start Verification"
              variant="primary"
              size="large"
              onPress={
                handleVerification
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}