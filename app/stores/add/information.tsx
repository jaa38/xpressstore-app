import { View, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";

import { Divider } from "@/components/ui/Divider";

import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";

import { Input } from "@/components/ui/Input";

import { AddStoreHeader } from "@/components/stores/AddStoreHeader";

import { AddStoreFooter } from "@/components/stores/AddStoreFooter";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import { storeInfoSchema, type StoreInfoForm } from "@/schemas/storeInfoSchema";

import { useStoreDraft } from "@/hooks/store/useStoreDraft";

import { useValidateStoreName } from "@/hooks/store/useValidateStoreName";

import { useValidateStoreReference } from "@/hooks/store/useValidateStoreReference";

import type { Currency } from "@/types/currency";

/**
 * ============================================================================
 * Currency Options
 * ============================================================================
 */

const currencyOptions: DropdownOption<Currency>[] = [
  {
    label: "Nigerian Naira (₦)",
    value: "NGN",
  },
  {
    label: "US Dollar ($)",
    value: "USD",
  },
  {
    label: "British Pound (£)",
    value: "GBP",
  },
  {
    label: "Euro (€)",
    value: "EUR",
  },
];

/**
 * ============================================================================
 * Store Information Screen
 * ============================================================================
 */

export default function StoreInformationScreen() {
  const { store, updateStore } = useStoreDraft();

  const validateStoreNameMutation = useValidateStoreName();

  const validateStoreReferenceMutation = useValidateStoreReference();

  const { control, handleSubmit, getValues } = useForm<StoreInfoForm>({
    resolver: zodResolver(storeInfoSchema),

    defaultValues: {
      storeName: store.storeName,

      storeReference: store.storeReference,

      currency: store.currency,

      description: store.description,

      welcomeMessage: store.welcomeMessage,
    },
  });

  /**
   * --------------------------------------------------------------------------
   * Continue
   * --------------------------------------------------------------------------
   *
   * Before moving to the next step:
   *
   * 1. Validate the store name with the API.
   * 2. Validate the store reference with the API.
   * 3. Generate the storefront URL.
   * 4. Save the information to the Store draft.
   */

  async function onSubmit(data: StoreInfoForm) {
    if (
      validateStoreNameMutation.isPending ||
      validateStoreReferenceMutation.isPending
    ) {
      return;
    }

    const storeName = data.storeName.trim();

    const storeReference = data.storeReference.trim().toLowerCase();

    /**
     * ------------------------------------------------------------------------
     * Validate Store Name
     * ------------------------------------------------------------------------
     */

    try {
      const response = await validateStoreNameMutation.mutateAsync(storeName);

      if (!response.data?.isAvailable) {
        return;
      }
    } catch (error) {
      console.error("Unable to validate store name:", error);

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * Validate Store Reference
     * ------------------------------------------------------------------------
     */

    try {
      const response =
        await validateStoreReferenceMutation.mutateAsync(storeReference);

      if (!response.data?.isAvailable) {
        return;
      }
    } catch (error) {
      console.error("Unable to validate store reference:", error);

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * Generate Store Link
     * ------------------------------------------------------------------------
     */

    const storeLink = `https://storelink.myxpresspay.com/store/${storeReference}`;

    /**
     * ------------------------------------------------------------------------
     * Save Draft
     * ------------------------------------------------------------------------
     */

    updateStore({
      ...data,

      storeName,

      storeReference,

      storeLink,
    });

    /**
     * ------------------------------------------------------------------------
     * Continue to Storefront
     * ------------------------------------------------------------------------
     */

    router.push(ROUTES.ADD_STORE_STOREFRONT);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Draft
   * --------------------------------------------------------------------------
   */

  function handleSaveDraft() {
    updateStore(getValues());

    router.back();
  }

  const isValidating =
    validateStoreNameMutation.isPending ||
    validateStoreReferenceMutation.isPending;

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      <AddStoreHeader
        title="Create Storefront"
        step={1}
        totalSteps={4}
        progress={25}
        label="Information"
      />

      <Divider />

      <View
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,

            paddingTop: spacing.md,

            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="body" color="secondary">
            Create your online storefront where customers can discover and
            purchase your products.
          </AppText>

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            {/* ============================================================= */}
            {/* STORE NAME */}
            {/* ============================================================= */}

            <Controller
              control={control}
              name="storeName"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label="Store Name"
                  required
                  placeholder="e.g. My Fashion Store"
                  value={value}
                  error={error?.message}
                  onChangeText={onChange}
                />
              )}
            />

            {/* ============================================================= */}
            {/* STORE REFERENCE */}
            {/* ============================================================= */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="storeReference"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Store Reference"
                    required
                    placeholder="e.g. my-fashion-store"
                    value={value}
                    error={error?.message}
                    autoCapitalize="none"
                    onChangeText={(text) =>
                      onChange(text.toLowerCase().replace(/\s+/g, "-"))
                    }
                  />
                )}
              />

              <AppText
                variant="caption"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                This becomes part of your storefront URL.
              </AppText>
            </View>

            {/* ============================================================= */}
            {/* CURRENCY */}
            {/* ============================================================= */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="currency"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Dropdown
                    label="Currency"
                    required
                    placeholder="Select currency"
                    options={currencyOptions}
                    value={value}
                    error={error?.message}
                    onSelect={onChange}
                  />
                )}
              />
            </View>

            {/* ============================================================= */}
            {/* DESCRIPTION */}
            {/* ============================================================= */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Description"
                    optional
                    variant="textarea"
                    maxLength={250}
                    placeholder="Tell customers about your store"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* ============================================================= */}
            {/* WELCOME MESSAGE */}
            {/* ============================================================= */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="welcomeMessage"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Welcome Message"
                    optional
                    variant="textarea"
                    maxLength={250}
                    placeholder="e.g. Welcome to our store!"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <Divider />

        <AddStoreFooter
          primaryLabel={isValidating ? "Checking..." : "Next"}
          secondaryLabel="Save as Draft"
          onPrimary={handleSubmit(onSubmit)}
          onSecondary={handleSaveDraft}
        />
      </View>
    </SafeAreaView>
  );
}
