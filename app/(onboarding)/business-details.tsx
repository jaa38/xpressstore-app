import { Pressable, View, ScrollView } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { Dropdown } from "@/components/ui/Dropdown";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";
import { useState } from "react";

import { useBusinessCategories } from "@/features/business/hooks/use-business-categories";

import { createBusiness } from "@/features/business/api/business-api";

type BusinessDetailsForm = {
  businessType: string;

  businessName: string;

  businessCategory: string;

  businessAddress: string;
};

export default function BusinessDetailsScreen() {
  const { control, handleSubmit, watch } = useForm<BusinessDetailsForm>({
    defaultValues: {
      businessType: "",

      businessName: "",

      businessCategory: "",

      businessAddress: "",
    },
  });

  const values = watch();

  const isValid = Boolean(
    values.businessType?.trim() &&
    values.businessName?.trim() &&
    values.businessCategory?.trim() &&
    values.businessAddress?.trim()
  );

  const { categories, isLoading } = useBusinessCategories();

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: BusinessDetailsForm) {
    try {
      setLoading(true);

      await createBusiness({
        businessName: data.businessName,

        businessType: data.businessType,

        businessCategory: data.businessCategory,

        businessAddress: data.businessAddress,
      });

      router.push(ROUTES.ID_VERIFICATION);
    } catch (error) {
      console.log("Failed to create business:", error);
    } finally {
      setLoading(false);
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
          <Link href={ROUTES.EMAIL_VERIFICATION} asChild>
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
            <ProgressBar progress={50} />
          </View>

          <AppText variant="bodySmall" color="muted">
            Step 2 of 4
          </AppText>
        </View>

        <View
          style={{
            gap: spacing.xs,
            paddingTop: spacing.lg,
          }}
        >
          <AppText variant="h1" color="heading">
            Set up your business
          </AppText>

          <AppText variant="body" color="secondary">
            Add a few details so customers know who they're buying from.
          </AppText>
        </View>

        {/* SCROLLABLE CONTENT */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            marginTop: spacing.lg,
            paddingBottom: spacing.lg,
            gap: spacing.md,
          }}
          style={{
            flex: 1,
          }}
        >
          <Controller
            control={control}
            name="businessName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Business Name"
                placeholder="Enter business name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="businessAddress"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Business Address"
                placeholder="Enter address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="businessType"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                label="Business Type"
                placeholder="Select type"
                value={value}
                options={[
                  {
                    label: "Individual",
                    value: "individual",
                  },
                  {
                    label: "Registered",
                    value: "registered",
                  },
                ]}
                onSelect={onChange}
              />
            )}
          />

          

          <Controller
            control={control}
            name="businessCategory"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                label="Business Category"
                placeholder={
                  isLoading ? "Loading categories..." : "Select category"
                }
                value={value}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                onSelect={onChange}
              />
            )}
          />
        </ScrollView>

        {/* BOTTOM SECTION */}

        <View
          style={{
            paddingBottom: spacing.lg,
          }}
        >
          <Button
            title={loading ? "Saving..." : "Continue"}
            variant="primary"
            size="large"
            disabled={!isValid || loading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
