import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
  Alert,
} from "react-native";

import { getApiErrorMessage } from "@/api/errors";

import { useUpdateBusinessDetails } from "@/hooks/merchant/useUpdateBusinessDetails";

import { useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import { AppText } from "@/components/ui/AppText";

import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";

import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

type BusinessDetailsForm = {
  businessName: string;

  tradingName: string;

  businessEmail: string;

  businessPhoneNumber: string;
};

/**
 * ============================================================================
 * EDIT BUSINESS SCREEN
 * ============================================================================
 */

export default function EditBusinessScreen() {
  /**
   * --------------------------------------------------------------------------
   * MERCHANT PROFILE
   * --------------------------------------------------------------------------
   */

  const {
    profile,

    isLoading,

    error,

    refetch,
  } = useMerchantProfile();

  /**
   * --------------------------------------------------------------------------
   * UPDATE BUSINESS DETAILS
   * --------------------------------------------------------------------------
   */

  const updateBusinessDetails = useUpdateBusinessDetails();

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const {
    control,

    watch,

    reset,

    handleSubmit,
  } = useForm<BusinessDetailsForm>({
    defaultValues: {
      businessName: "",

      tradingName: "",

      businessEmail: "",

      businessPhoneNumber: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * FORM VALUES
   * --------------------------------------------------------------------------
   */

  const values = watch();

  /**
   * --------------------------------------------------------------------------
   * FORM VALIDATION
   * --------------------------------------------------------------------------
   *
   * Business name is required.
   *
   * The remaining fields can remain optional because the current
   * merchant API profile may not always contain them.
   */

  const isFormValid = Boolean(values.businessName?.trim());

  /**
   * ==========================================================================
   * POPULATE FORM
   * ==========================================================================
   *
   * The profile is loaded asynchronously, so reset the form once
   * the merchant profile becomes available.
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      businessName: profile.businessName ?? "",

      tradingName: profile.tradingName ?? "",

      businessEmail: profile.businessEmail ?? "",

      businessPhoneNumber: profile.businessPhoneNumber ?? "",
    });
  }, [profile, reset]);

  /**
   * ==========================================================================
   * SAVE BUSINESS DETAILS
   * ==========================================================================
   */

  async function onSubmit(data: BusinessDetailsForm) {
    /**
     * Prevent duplicate requests.
     */

    if (updateBusinessDetails.isPending) {
      return;
    }

    /**
     * Merchant ID is required by the update API.
     */

    if (!profile?.merchantId) {
      Alert.alert(
        "Unable to Save Changes",
        "Your merchant information could not be found. Please try again."
      );

      return;
    }

    /**
     * Validate business name.
     */

    if (!data.businessName.trim()) {
      Alert.alert("Business Name Required", "Please enter your business name.");

      return;
    }

    try {
      /**
       * Update business details.
       */

      await updateBusinessDetails.mutateAsync({
        merchantId: profile.merchantId,

        businessName: data.businessName.trim(),

        tradingName: data.tradingName.trim(),

        businessEmail: data.businessEmail.trim(),

        businessPhoneNumber: data.businessPhoneNumber.trim(),
      });

      Alert.alert(
        "Business Updated",
        "Your business information has been successfully updated.",
        [
          {
            text: "OK",

            onPress: () => {
              if (router.canGoBack()) {
                router.back();

                return;
              }

              router.replace(ROUTES.BUSINESS);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Unable to Save Changes", getApiErrorMessage(error));
    }
  }

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

  if (isLoading && !profile) {
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

            justifyContent: "center",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
          <ActivityIndicator size="large" color={theme.icon.branding.icon} />

          <AppText variant="body" color="secondary">
            Loading business information...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * ERROR
   * ==========================================================================
   */

  if (error && !profile) {
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

            justifyContent: "center",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 56,

              height: 56,

              borderRadius: radius.full,

              justifyContent: "center",

              alignItems: "center",

              backgroundColor: theme.icon.default.background,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={theme.icon.default.icon}
            />
          </View>

          <View
            style={{
              alignItems: "center",

              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">Unable to load business</AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                textAlign: "center",
              }}
            >
              We couldn't load your business information. Please try again.
            </AppText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try loading business information again"
            onPress={() => refetch()}
            style={{
              flexDirection: "row",

              alignItems: "center",

              gap: spacing.sm,

              paddingHorizontal: spacing.md,

              paddingVertical: spacing.sm,

              borderRadius: radius.md,

              backgroundColor: theme.background.brand,
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={theme.icon.branding.icon}
            />

            <AppText variant="bodyBold">Try Again</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
   */

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
        {/* ================================================================
            HEADER
        ================================================================ */}

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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();

                return;
              }

              router.replace(ROUTES.BUSINESS);
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

          {/* TITLE */}

          <View
            style={{
              flex: 1,

              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Edit Business</AppText>

            <AppText variant="bodySmall" color="secondary">
              Update your business information.
            </AppText>
          </View>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,

            paddingBottom: spacing.xl,

            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
        >
          {/* ============================================================
              INTRODUCTION
          ============================================================ */}

          <Card variant="description">
            <View
              style={{
                flexDirection: "row",

                alignItems: "flex-start",

                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.icon.default.icon}
                style={{
                  marginTop: 2,
                }}
              />

              <View
                style={{
                  flex: 1,

                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodySmallBold">
                  Keep your information up to date
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  Your business information helps customers identify your
                  business and contact you when necessary.
                </AppText>
              </View>
            </View>
          </Card>

          {/* ============================================================
              BUSINESS DETAILS
          ============================================================ */}

          <View
            style={{
              gap: spacing.md,
            }}
          >
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyLargeBold">Business Details</AppText>

              <AppText variant="bodySmall" color="secondary">
                Update your business name and trading information.
              </AppText>
            </View>

            {/* BUSINESS NAME */}

            <Controller
              control={control}
              name="businessName"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Business Name"
                  placeholder="Enter business name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* TRADING NAME */}

            <Controller
              control={control}
              name="tradingName"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Trading Name"
                  placeholder="Enter trading name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ============================================================
              CONTACT DETAILS
          ============================================================ */}

          <View
            style={{
              gap: spacing.md,
            }}
          >
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyLargeBold">Contact Details</AppText>

              <AppText variant="bodySmall" color="secondary">
                Update the contact details linked to your business.
              </AppText>
            </View>

            {/* BUSINESS EMAIL */}

            <Controller
              control={control}
              name="businessEmail"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Business Email"
                  placeholder="Enter business email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* BUSINESS PHONE */}

            <Controller
              control={control}
              name="businessPhoneNumber"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Business Phone Number"
                  placeholder="Enter business phone number"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ============================================================
              READ-ONLY BUSINESS INFORMATION
          ============================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyLargeBold">Registered Information</AppText>

              <AppText variant="bodySmall" color="secondary">
                These details are currently managed separately.
              </AppText>
            </View>

            <Card>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                {/* BUSINESS TYPE */}

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="secondary">
                    Business Type
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessType || "Not specified"}
                  </AppText>
                </View>

                {/* BUSINESS CATEGORY */}

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="secondary">
                    Business Category
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessCategory || "Not specified"}
                  </AppText>
                </View>

                {/* BUSINESS ADDRESS */}

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="secondary">
                    Business Address
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessAddress || "Not specified"}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <View
          style={{
            paddingTop: spacing.sm,

            paddingBottom: spacing.lg,
          }}
        >
          <Button
            title={
              updateBusinessDetails.isPending ? "Saving..." : "Save Changes"
            }
            variant="primary"
            size="large"
            disabled={!isFormValid || updateBusinessDetails.isPending}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
