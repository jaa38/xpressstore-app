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

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { useVerifyBVN } from "@/hooks/kyc/useVerifyBVN";

type IdVerificationForm = {
  idType: string;

  idNumber: string;
};

export default function IdVerificationScreen() {
  const { control, handleSubmit, watch } = useForm<IdVerificationForm>({
    defaultValues: {
      idType: "bvn",

      idNumber: "",
    },
  });

  const { idNumber, idType } = watch();

  const isValid = idType.length > 0 && idNumber.length === 11;

  const { setBVN, setVerifiedBVN } = useOnboardingStore();

  const verifyBVN = useVerifyBVN();

  async function onSubmit(data: IdVerificationForm) {
    try {
      const response = await verifyBVN.mutateAsync({
        bvn: data.idNumber,
      });

      setBVN(data.idNumber);

      setVerifiedBVN(response.data);

      router.push(ROUTES.DOCUMENT_UPLOAD);
    } catch (error) {
      Alert.alert("Verification Failed", "Unable to verify your identity.");
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
        {/* HEADER */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "space-between",
          }}
        >
          <Link href={ROUTES.BUSINESS_DETAILS} asChild>
            <Pressable>
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
                Required by the Central Bank of Nigeria to receive payments.
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
                  alignSelf: "center",
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

          {/* FORM */}

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
                  placeholder="11-digit number"
                  keyboardType="number-pad"
                  maxLength={11}
                  value={value}
                  onChangeText={onChange}
                  helperText="Must be 11 digits"
                />
              )}
            />
          </View>
        </ScrollView>

        {/* FOOTER */}

        <View
          style={{
            paddingBottom: spacing.lg,
          }}
        >
          <Button
            title="Continue"
            variant="primary"
            size="large"
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
