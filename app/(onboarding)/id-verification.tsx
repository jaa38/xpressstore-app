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

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

type IdVerificationForm = {
  idType: string;

  idNumber: string;
};

export default function IdVerificationScreen() {
  const { control, handleSubmit, watch } = useForm<IdVerificationForm>({
    defaultValues: {
      idType: "",

      idNumber: "",
    },
  });

  const values = watch();

  const isValid = Boolean(values.idType && values.idNumber.trim());

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

          <Controller
            control={control}
            name="idType"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                label="ID Type"
                placeholder="Select ID Type"
                value={value}
                options={[
                  {
                    label: "National ID Card",

                    value: "national-id",
                  },

                  {
                    label: "International Passport",

                    value: "passport",
                  },

                  {
                    label: "Driver's License",

                    value: "drivers-license",
                  },

                  {
                    label: "Voter's Card",

                    value: "voters-card",
                  },
                ]}
                onSelect={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="idNumber"
            render={({ field: { value, onChange } }) => (
              <Input
                label="ID Number"
                placeholder="Enter ID Number"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Pressable
            style={{
              height: 140,

              borderWidth: 1,

              borderStyle: "dashed",

              borderColor: theme.divider.default,

              borderRadius: 12,

              justifyContent: "center",

              alignItems: "center",

              gap: spacing.sm,
            }}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={theme.icon.default.icon}
            />

            <AppText variant="body">Upload ID Document</AppText>
          </Pressable>
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
