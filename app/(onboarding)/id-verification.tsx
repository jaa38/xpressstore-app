import { Pressable, View, ScrollView } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppText } from "@/components/ui/AppText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DatePicker } from "@/components/ui/DatePicker";
import { PhoneNumberInput } from "@/components/ui/PhoneInput";

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { validatePhoneNumber, formatPhoneNumber } from "@/utils/phone";

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

type IdVerificationForm = {
  idType: string;

  idNumber: string;

  fullName: string;

  phoneNumber: string;

  countryCode: string;

  dateOfBirth: Date | null;
};

export default function IdVerificationScreen() {
  const { control, handleSubmit, watch, setValue } =
    useForm<IdVerificationForm>({
      defaultValues: {
        idType: "",

        idNumber: "",

        fullName: "",

        phoneNumber: "",

        countryCode: "NG",

        dateOfBirth: null,
      },
    });

  const values = watch();

  const isPhoneValid = validatePhoneNumber(
    values.phoneNumber,
    values.countryCode
  );

  const isValid = Boolean(
    values.fullName.trim() &&
    values.dateOfBirth &&
    values.idType &&
    values.idNumber.trim() &&
    values.idNumber.length === 11 &&
    isPhoneValid
  );

  function onSubmit(data: IdVerificationForm) {
    const payload = {
      ...data,

      phoneNumber: formatPhoneNumber(data.phoneNumber, data.countryCode),
    };

    console.log("ID Verification:", payload);

    router.push(ROUTES.BIOMETRIC_VERIFICATION);
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
              name="fullName"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Full Name (as on ID)"
                  placeholder="Enter full name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label="Date of Birth"
                  placeholder="Select Date of Birth"
                  value={value ?? undefined}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { value, onChange } }) => (
                <PhoneNumberInput
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  countryCode={watch("countryCode") || "NG"}
                  onCountryCodeChange={(code) =>
                    setValue("countryCode", code, {
                      shouldValidate: true,
                    })
                  }
                  error={
                    value && !validatePhoneNumber(value, watch("countryCode"))
                      ? "Invalid phone number"
                      : undefined
                  }
                />
              )}
            />

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
