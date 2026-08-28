import { Pressable, View, ScrollView, Alert } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppText } from "@/components/ui/AppText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Dropdown } from "@/components/ui/Dropdown";

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { useVerifyBVN } from "@/hooks/kyc/useVerifyBVN";

import { useKycTiers } from "@/hooks/kyc/useKycTiers";

import { getApiErrorMessage } from "@/api/errors";

type IdVerificationForm = {
  idType: string;
  idNumber: string;
  kycTierId: string;
};

export default function IdVerificationScreen() {
  const { control, handleSubmit, watch } = useForm<IdVerificationForm>({
    defaultValues: {
      idType: "bvn",
      idNumber: "",
      kycTierId: "",
    },
  });

  const { idNumber, idType, kycTierId } = watch();

  const { setBVN, setVerifiedBVN, setKycTierId } = useOnboardingStore();

  const verifyBVN = useVerifyBVN();

  const { kycTiers, isLoading: isLoadingKycTiers } = useKycTiers();

  const isValid =
    idType.length > 0 && idNumber.length === 11 && kycTierId.length > 0;

  async function onSubmit(data: IdVerificationForm) {
    try {
      /**
       * -----------------------------------------------------------------------
       * Store selected KYC tier
       * -----------------------------------------------------------------------
       */

      setKycTierId(data.kycTierId);

      /**
       * -----------------------------------------------------------------------
       * Verify BVN
       * -----------------------------------------------------------------------
       */

      const response = await verifyBVN.mutateAsync({
        bvn: data.idNumber,
      });

      if (!response.data) {
        throw new Error(
          response.responseMessage || "Unable to verify your identity."
        );
      }

      setBVN(data.idNumber);

      setVerifiedBVN(response.data);

      router.push(ROUTES.DOCUMENT_UPLOAD);
    } catch (error) {
      Alert.alert("Verification Failed", getApiErrorMessage(error));
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
        {/* ================================================================
            HEADER
        ================================================================= */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "space-between",
          }}
        >
          <Link href={ROUTES.BUSINESS_DETAILS} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          </Link>

          <View
            style={{
              flex: 1,
              height: 8,
              backgroundColor: theme.divider.default,
              borderRadius: 999,
              overflow: "hidden",
              marginHorizontal: spacing.sm,
            }}
          >
            <ProgressBar progress={75} />
          </View>

          <AppText variant="bodySmall" color="muted">
            Step 3 of 4
          </AppText>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================= */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            gap: spacing.lg,
            paddingBottom: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* TITLE */}

          <View>
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1" color="heading">
                Verify your identity
              </AppText>

              <AppText variant="body" color="secondary">
                Verify your identity to receive payments securely.
              </AppText>
            </View>

            {/* SECURITY BANNER */}

            <View
              style={{
                marginTop: spacing.lg,
                paddingVertical: spacing.rg,
                paddingHorizontal: spacing.md,
                backgroundColor: theme.background.brand,
                borderRadius: radius.sm,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={theme.icon.success.icon}
                style={{
                  marginTop: 2,
                }}
              />

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="bodySmall" color="strong">
                  Your information is encrypted and securely verified to comply
                  with financial regulations.
                </AppText>
              </View>
            </View>
          </View>

          {/* ================================================================
              FORM
          ================================================================= */}

          <View
            style={{
              gap: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="idType"
              render={({ field: { value, onChange } }) => (
                <ToggleSwitch
                  label="ID Type"
                  value={value}
                  fullWidth
                  options={[
                    {
                      label: "NIN",
                      value: "nin",
                    },
                    {
                      label: "BVN",
                      value: "bvn",
                    },
                  ]}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="idNumber"
              render={({ field: { value, onChange } }) => (
                <Input
                  label={idType === "nin" ? "NIN" : "BVN"}
                  placeholder="11-digit number"
                  keyboardType="number-pad"
                  maxLength={11}
                  value={value}
                  onChangeText={onChange}
                  helperText="Must be 11 digits"
                />
              )}
            />

            {/* ============================================================
                KYC TIER
            ============================================================= */}

            <Controller
              control={control}
              name="kycTierId"
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  label="Verification Tier"
                  placeholder={
                    isLoadingKycTiers
                      ? "Loading verification tiers..."
                      : "Select verification tier"
                  }
                  value={value}
                  options={kycTiers.map((tier) => ({
                    label: tier.name,
                    value: String(tier.id),
                  }))}
                  onSelect={onChange}
                />
              )}
            />
          </View>
        </ScrollView>

        {/* ================================================================
            FOOTER
        ================================================================= */}

        <View
          style={{
            paddingBottom: spacing.lg,
          }}
        >
          <Button
            title={verifyBVN.isPending ? "Verifying..." : "Continue"}
            variant="primary"
            size="large"
            disabled={!isValid || verifyBVN.isPending || isLoadingKycTiers}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
