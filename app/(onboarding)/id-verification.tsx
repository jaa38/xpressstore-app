import { Pressable, View, ScrollView } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppText } from "@/components/ui/AppText";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { DatePicker } from "@/components/ui/DatePicker";

type IdVerificationForm = {
  fullName: string;

  dateOfBirth: Date | null;
};

export default function IdVerificationScreen() {
  const { control, handleSubmit, watch } = useForm<IdVerificationForm>({
    defaultValues: {
      fullName: "",

      dateOfBirth: null,
    },
  });

  const values = watch();

  const isValid = Boolean(values.fullName.trim() && values.dateOfBirth);

  function onSubmit(data: IdVerificationForm) {
    console.log("ID Verification", data);

    // Step 4
    // router.push(ROUTES.STORE_SETUP);
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
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={{ gap: spacing.xs }}>
              <AppText variant="h1" color="heading">
                Verify your identity
              </AppText>

              <AppText variant="body" color="secondary">
                Required by the Central Bank of Nigeria to receive payments.
              </AppText>
            </View>

            <View
              style={{
                marginTop: spacing.lg,
                paddingVertical: spacing.rg,
                paddingHorizontal: spacing.md,
                backgroundColor: theme.background.brand,
                borderRadius: radius.sm,
              }}
            >
              <AppText variant="body" color="strong">
                Your information encrypted and securely verified to comply with
                financial regulations
              </AppText>
            </View>
          </View>

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
          </View>
        </ScrollView>

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
